import pytest
from rest_framework.test import APIClient

from apps.accounts.models import UserAccount
from apps.accounts.services import issue_access_token
from apps.sharing.models import ShareStatus


@pytest.fixture
def api_client():
    owner = UserAccount.objects.create(
        cognito_sub="local:test-owner",
        email="owner@example.com",
        name="Owner",
    )
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {issue_access_token(owner)}")
    return client


@pytest.mark.django_db
def test_task_category_crud_and_status_actions(api_client):
    category_response = api_client.post(
        "/api/v1/categories/",
        {"name": "Work", "color": "#2563EB"},
        format="json",
    )
    assert category_response.status_code == 201

    task_response = api_client.post(
        "/api/v1/tasks/",
        {
            "category": category_response.json()["id"],
            "title": "Ship API",
            "description": "Cover the main task lifecycle.",
            "priority": "high",
        },
        format="json",
    )
    assert task_response.status_code == 201
    task_id = task_response.json()["id"]

    complete_response = api_client.patch(f"/api/v1/tasks/{task_id}/complete/", format="json")
    assert complete_response.status_code == 200
    assert complete_response.json()["status"] == "completed"

    reopen_response = api_client.patch(f"/api/v1/tasks/{task_id}/reopen/", format="json")
    assert reopen_response.status_code == 200
    assert reopen_response.json()["status"] == "pending"


@pytest.mark.django_db
def test_owner_can_share_and_recipient_can_accept(api_client):
    recipient = UserAccount.objects.create(
        cognito_sub="recipient-sub",
        email="recipient@example.com",
        name="Recipient",
    )
    task_response = api_client.post(
        "/api/v1/tasks/",
        {"title": "Shareable task", "priority": "medium"},
        format="json",
    )
    task_id = task_response.json()["id"]

    share_response = api_client.post(
        f"/api/v1/tasks/{task_id}/shares/",
        {"recipient_email": recipient.email, "permission": "editor"},
        format="json",
    )
    assert share_response.status_code == 202
    assert share_response.json()["shared_by"]
    assert share_response.json()["status"] == ShareStatus.PENDING

    recipient_client = APIClient()
    recipient_client.credentials(HTTP_AUTHORIZATION=f"Bearer {issue_access_token(recipient)}")
    accept_response = recipient_client.patch(
        f"/api/v1/shares/{share_response.json()['id']}/",
        {"status": "accepted"},
        format="json",
    )

    assert accept_response.status_code == 200
    assert accept_response.json()["status"] == ShareStatus.ACCEPTED
    assert accept_response.json()["responded_at"]


@pytest.mark.django_db
def test_task_update_audit_serializes_category_and_datetime(api_client, monkeypatch):
    category_response = api_client.post(
        "/api/v1/categories/",
        {"name": "Planning", "color": "#2563EB"},
        format="json",
    )
    task_response = api_client.post(
        "/api/v1/tasks/",
        {"title": "Initial title"},
        format="json",
    )
    monkeypatch.setattr(
        "apps.tasks.services.HolidayClient.get_national_holiday",
        lambda _client, _date: None,
    )

    update_response = api_client.patch(
        f"/api/v1/tasks/{task_response.json()['id']}/",
        {
            "title": "Updated title",
            "category": category_response.json()["id"],
            "due_at": "2026-07-20T14:30:00Z",
        },
        format="json",
    )

    assert update_response.status_code == 200
    assert update_response.json()["access_role"] == "owner"
    from apps.audit.models import AuditLog

    audit = AuditLog.objects.get(action="task.updated")
    assert audit.changes["category"] == category_response.json()["id"]
    assert audit.changes["due_at"].startswith("2026-07-20T")


@pytest.mark.django_db
def test_editor_can_update_but_cannot_delete_shared_task(api_client):
    recipient = UserAccount.objects.create(
        cognito_sub="local:editor",
        email="editor@example.com",
        name="Editor",
    )
    task_response = api_client.post(
        "/api/v1/tasks/",
        {"title": "Protected task"},
        format="json",
    )
    share_response = api_client.post(
        f"/api/v1/tasks/{task_response.json()['id']}/shares/",
        {"recipient_email": recipient.email, "permission": "editor"},
        format="json",
    )

    recipient_client = APIClient()
    recipient_client.credentials(HTTP_AUTHORIZATION=f"Bearer {issue_access_token(recipient)}")
    assert (
        recipient_client.patch(
            f"/api/v1/shares/{share_response.json()['id']}/",
            {"status": "accepted"},
            format="json",
        ).status_code
        == 200
    )

    task_id = task_response.json()["id"]
    update_response = recipient_client.patch(
        f"/api/v1/tasks/{task_id}/",
        {"title": "Updated by editor"},
        format="json",
    )
    delete_response = recipient_client.delete(f"/api/v1/tasks/{task_id}/")

    assert update_response.status_code == 200
    assert delete_response.status_code == 403


@pytest.mark.django_db
def test_readiness_endpoint_checks_database(client):
    response = client.get("/api/v1/readiness/")

    assert response.status_code == 200
    assert response.json() == {"status": "ready", "database": "ok"}
