import pytest
from rest_framework.test import APIClient

from apps.accounts.models import UserAccount
from apps.sharing.models import ShareStatus


@pytest.fixture
def api_client():
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION="Bearer dev-token")
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
    recipient_client.credentials(HTTP_AUTHORIZATION="Bearer recipient-token")

    with pytest.MonkeyPatch.context() as monkeypatch:
        monkeypatch.setattr(
            "apps.accounts.authentication.CognitoJWTAuthentication._claims_from_token",
            lambda _self, _token: type(
                "Claims",
                (),
                {"sub": recipient.cognito_sub, "email": recipient.email, "name": recipient.name},
            )(),
        )
        accept_response = recipient_client.patch(
            f"/api/v1/shares/{share_response.json()['id']}/",
            {"status": "accepted"},
            format="json",
        )

    assert accept_response.status_code == 200
    assert accept_response.json()["status"] == ShareStatus.ACCEPTED
    assert accept_response.json()["responded_at"]


@pytest.mark.django_db
def test_readiness_endpoint_checks_database(client):
    response = client.get("/api/v1/readiness/")

    assert response.status_code == 200
    assert response.json() == {"status": "ready", "database": "ok"}
