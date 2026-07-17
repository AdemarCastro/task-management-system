from datetime import timedelta

import pytest
from django.utils import timezone
from rest_framework.test import APIClient

from apps.accounts.models import UserAccount
from apps.accounts.services import issue_access_token
from apps.audit.models import AuditLog
from apps.categories.models import Category
from apps.sharing.models import TaskShare
from apps.tasks.models import Task, TaskStatus


def create_user(email: str, name: str = "User") -> UserAccount:
    return UserAccount.objects.create(
        cognito_sub=f"local:{email}",
        email=email,
        name=name,
    )


def authenticated_client(user: UserAccount) -> APIClient:
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {issue_access_token(user)}")
    return client


def create_share(owner_client, task_id, recipient, permission="viewer"):
    response = owner_client.post(
        f"/api/v1/tasks/{task_id}/shares/",
        {"recipient_email": recipient.email, "permission": permission},
        format="json",
    )
    assert response.status_code == 202
    return response.json()


def accept_share(recipient_client, share_id):
    response = recipient_client.patch(
        f"/api/v1/shares/{share_id}/",
        {"status": "accepted"},
        format="json",
    )
    assert response.status_code == 200
    return response.json()


@pytest.mark.django_db
def test_task_status_is_read_only_and_uses_explicit_actions(monkeypatch):
    owner = create_user("status-owner@example.com")
    client = authenticated_client(owner)
    monkeypatch.setattr(
        "apps.tasks.services.HolidayClient.get_national_holiday",
        lambda _client, _date: None,
    )
    task = client.post("/api/v1/tasks/", {"title": "Status task"}, format="json").json()

    patch_response = client.patch(
        f"/api/v1/tasks/{task['id']}/",
        {"title": "Renamed", "status": "completed"},
        format="json",
    )
    assert patch_response.status_code == 200
    assert patch_response.json()["title"] == "Renamed"
    assert patch_response.json()["status"] == TaskStatus.PENDING

    complete_response = client.patch(f"/api/v1/tasks/{task['id']}/complete/", format="json")
    assert complete_response.status_code == 200
    assert complete_response.json()["status"] == TaskStatus.COMPLETED
    assert AuditLog.objects.filter(task_id=task["id"], action="task.completed").exists()

    reopen_response = client.patch(f"/api/v1/tasks/{task['id']}/reopen/", format="json")
    assert reopen_response.status_code == 200
    assert reopen_response.json()["status"] == TaskStatus.PENDING
    assert AuditLog.objects.filter(task_id=task["id"], action="task.reopened").exists()


@pytest.mark.django_db
def test_editor_updates_fields_but_cannot_change_category_or_delete(monkeypatch):
    owner = create_user("shared-owner@example.com", "Owner")
    editor = create_user("shared-editor@example.com", "Editor")
    owner_client = authenticated_client(owner)
    editor_client = authenticated_client(editor)
    monkeypatch.setattr(
        "apps.tasks.services.HolidayClient.get_national_holiday",
        lambda _client, _date: None,
    )

    owner_category = owner_client.post(
        "/api/v1/categories/",
        {"name": "Owner category", "color": "#111111"},
        format="json",
    ).json()
    editor_category = editor_client.post(
        "/api/v1/categories/",
        {"name": "Editor category", "color": "#222222"},
        format="json",
    ).json()
    task = owner_client.post(
        "/api/v1/tasks/",
        {"title": "Shared task", "category": owner_category["id"]},
        format="json",
    ).json()
    share = create_share(owner_client, task["id"], editor, "editor")
    accept_share(editor_client, share["id"])

    update_response = editor_client.patch(
        f"/api/v1/tasks/{task['id']}/",
        {
            "title": "Updated by editor",
            "description": "Allowed fields",
            "priority": "high",
            "due_at": (timezone.now() + timedelta(days=2)).isoformat(),
        },
        format="json",
    )
    assert update_response.status_code == 200
    assert update_response.json()["title"] == "Updated by editor"
    assert update_response.json()["category"] == owner_category["id"]

    category_response = editor_client.patch(
        f"/api/v1/tasks/{task['id']}/",
        {"category": editor_category["id"]},
        format="json",
    )
    assert category_response.status_code == 400
    assert editor_client.delete(f"/api/v1/tasks/{task['id']}/").status_code == 403
    assert editor_client.patch(f"/api/v1/tasks/{task['id']}/complete/").status_code == 200


@pytest.mark.django_db
def test_viewer_is_read_only_and_unrelated_user_cannot_access():
    owner = create_user("viewer-owner@example.com")
    viewer = create_user("viewer@example.com")
    stranger = create_user("stranger@example.com")
    owner_client = authenticated_client(owner)
    viewer_client = authenticated_client(viewer)
    stranger_client = authenticated_client(stranger)
    task = owner_client.post("/api/v1/tasks/", {"title": "Read only"}, format="json").json()
    share = create_share(owner_client, task["id"], viewer, "viewer")
    accept_share(viewer_client, share["id"])

    assert viewer_client.get(f"/api/v1/tasks/{task['id']}/").status_code == 200
    assert viewer_client.patch(
        f"/api/v1/tasks/{task['id']}/",
        {"title": "Forbidden"},
        format="json",
    ).status_code == 403
    assert viewer_client.patch(f"/api/v1/tasks/{task['id']}/complete/").status_code == 403
    assert viewer_client.delete(f"/api/v1/tasks/{task['id']}/").status_code == 403
    assert stranger_client.get(f"/api/v1/tasks/{task['id']}/").status_code == 404


@pytest.mark.django_db
def test_soft_deleted_task_is_hidden_and_cannot_be_used():
    owner = create_user("delete-owner@example.com")
    client = authenticated_client(owner)
    task = client.post("/api/v1/tasks/", {"title": "Delete me"}, format="json").json()

    delete_response = client.delete(f"/api/v1/tasks/{task['id']}/")
    assert delete_response.status_code == 204
    stored = Task.objects.get(id=task["id"])
    assert stored.deleted_at is not None
    assert AuditLog.objects.filter(task=stored, action="task.deleted").exists()
    assert client.get(f"/api/v1/tasks/{task['id']}/").status_code == 404
    assert client.patch(f"/api/v1/tasks/{task['id']}/complete/").status_code == 404
    listed_ids = {item["id"] for item in client.get("/api/v1/tasks/").json()["results"]}
    assert task["id"] not in listed_ids


@pytest.mark.django_db
def test_category_crud_is_isolated_and_delete_sets_task_category_null():
    owner = create_user("category-owner@example.com")
    other = create_user("category-other@example.com")
    owner_client = authenticated_client(owner)
    other_client = authenticated_client(other)

    category_response = owner_client.post(
        "/api/v1/categories/",
        {"name": "Work", "color": "#123456"},
        format="json",
    )
    assert category_response.status_code == 201
    category_id = category_response.json()["id"]
    assert owner_client.patch(
        f"/api/v1/categories/{category_id}/",
        {"name": "Work updated"},
        format="json",
    ).status_code == 200
    assert other_client.get(f"/api/v1/categories/{category_id}/").status_code == 404

    duplicate_response = owner_client.post(
        "/api/v1/categories/",
        {"name": "Work updated", "color": "#654321"},
        format="json",
    )
    assert duplicate_response.status_code == 400

    task = owner_client.post(
        "/api/v1/tasks/",
        {"title": "Categorized", "category": category_id},
        format="json",
    ).json()
    assert owner_client.delete(f"/api/v1/categories/{category_id}/").status_code == 204
    assert Task.objects.get(id=task["id"]).category_id is None


@pytest.mark.django_db
def test_sharing_validation_decisions_and_owner_cancellation():
    owner = create_user("invite-owner@example.com")
    recipient = create_user("invite-recipient@example.com")
    other = create_user("invite-other@example.com")
    fourth_user = create_user("invite-fourth@example.com")
    owner_client = authenticated_client(owner)
    recipient_client = authenticated_client(recipient)
    other_client = authenticated_client(other)
    task = owner_client.post("/api/v1/tasks/", {"title": "Invite task"}, format="json").json()

    self_response = owner_client.post(
        f"/api/v1/tasks/{task['id']}/shares/",
        {"recipient_email": owner.email, "permission": "viewer"},
        format="json",
    )
    assert self_response.status_code == 400

    share = create_share(owner_client, task["id"], recipient, "viewer")
    duplicate_response = owner_client.post(
        f"/api/v1/tasks/{task['id']}/shares/",
        {"recipient_email": recipient.email, "permission": "editor"},
        format="json",
    )
    assert duplicate_response.status_code == 400

    assert owner_client.patch(
        f"/api/v1/shares/{share['id']}/",
        {"status": "accepted"},
        format="json",
    ).status_code == 403
    assert recipient_client.delete(f"/api/v1/shares/{share['id']}/").status_code == 403
    accept_share(recipient_client, share["id"])
    assert recipient_client.patch(
        f"/api/v1/shares/{share['id']}/",
        {"status": "rejected"},
        format="json",
    ).status_code == 400

    non_owner_share = other_client.post(
        f"/api/v1/tasks/{task['id']}/shares/",
        {"recipient_email": fourth_user.email, "permission": "viewer"},
        format="json",
    )
    assert non_owner_share.status_code in {403, 404}

    assert owner_client.delete(f"/api/v1/shares/{share['id']}/").status_code == 204
    assert not TaskShare.objects.filter(id=share["id"]).exists()
    assert recipient_client.get(f"/api/v1/tasks/{task['id']}/").status_code == 404
    assert AuditLog.objects.filter(task_id=task["id"], action="task.unshared").exists()


@pytest.mark.django_db
def test_filters_ordering_pagination_and_user_isolation(monkeypatch):
    owner = create_user("filters-owner@example.com")
    other = create_user("filters-other@example.com")
    client = authenticated_client(owner)
    other_client = authenticated_client(other)
    monkeypatch.setattr(
        "apps.tasks.services.HolidayClient.get_national_holiday",
        lambda _client, _date: None,
    )

    work = client.post(
        "/api/v1/categories/",
        {"name": "Work", "color": "#111111"},
        format="json",
    ).json()
    now = timezone.now()
    payloads = [
        {"title": "Alpha report", "priority": "high", "category": work["id"], "due_at": (now + timedelta(days=1)).isoformat()},
        {"title": "Beta task", "priority": "low", "category": work["id"], "due_at": (now + timedelta(days=3)).isoformat()},
        {"title": "Gamma report", "priority": "medium", "due_at": (now + timedelta(days=5)).isoformat()},
    ]
    for payload in payloads:
        assert client.post("/api/v1/tasks/", payload, format="json").status_code == 201
    assert other_client.post("/api/v1/tasks/", {"title": "Other report"}, format="json").status_code == 201

    search_response = client.get("/api/v1/tasks/", {"search": "report"})
    assert search_response.status_code == 200
    assert search_response.json()["count"] == 2

    category_response = client.get(
        "/api/v1/tasks/",
        {"category": work["id"], "ordering": "due_at"},
    )
    assert category_response.json()["count"] == 2
    due_dates = [item["due_at"] for item in category_response.json()["results"]]
    assert due_dates == sorted(due_dates)

    combined = client.get(
        "/api/v1/tasks/",
        {
            "priority": "high",
            "category": work["id"],
            "due_before": (now + timedelta(days=2)).isoformat(),
        },
    )
    assert combined.json()["count"] == 1
    assert combined.json()["results"][0]["title"] == "Alpha report"

    page_one = client.get("/api/v1/tasks/", {"page": 1, "page_size": 2})
    page_two = client.get("/api/v1/tasks/", {"page": 2, "page_size": 2})
    assert page_one.json()["count"] == 3
    assert len(page_one.json()["results"]) == 2
    assert len(page_two.json()["results"]) == 1
    assert all(item["title"] != "Other report" for item in page_one.json()["results"])


@pytest.mark.django_db
def test_deleted_task_cannot_be_shared():
    owner = create_user("deleted-share-owner@example.com")
    recipient = create_user("deleted-share-recipient@example.com")
    client = authenticated_client(owner)
    task = client.post("/api/v1/tasks/", {"title": "Deleted share"}, format="json").json()
    assert client.delete(f"/api/v1/tasks/{task['id']}/").status_code == 204

    response = client.post(
        f"/api/v1/tasks/{task['id']}/shares/",
        {"recipient_email": recipient.email, "permission": "viewer"},
        format="json",
    )
    assert response.status_code == 400


@pytest.mark.django_db
def test_category_from_another_owner_cannot_be_used():
    owner = create_user("task-owner@example.com")
    other = create_user("foreign-category@example.com")
    owner_client = authenticated_client(owner)
    foreign_category = Category.objects.create(owner=other, name="Foreign")

    response = owner_client.post(
        "/api/v1/tasks/",
        {"title": "Invalid category", "category": str(foreign_category.id)},
        format="json",
    )
    assert response.status_code == 400
