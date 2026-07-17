from urllib.parse import parse_qs, urlparse

import pytest
from django.core import mail
from django.test import override_settings
from rest_framework.test import APIClient

from apps.accounts.models import UserAccount


@pytest.mark.django_db
@override_settings(DEBUG=True, EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend")
def test_register_login_change_and_reset_password_flow():
    client = APIClient()
    register_response = client.post(
        "/api/v1/auth/register/",
        {
            "name": "Ada Lovelace",
            "email": "Ada@Example.com",
            "password": "StrongPassword123!",
            "password_confirmation": "StrongPassword123!",
        },
        format="json",
    )

    assert register_response.status_code == 201
    assert register_response.json()["user"]["email"] == "ada@example.com"
    assert register_response.json()["access_token"]

    old_password_login = client.post(
        "/api/v1/auth/login/",
        {"email": "ada@example.com", "password": "StrongPassword123!"},
        format="json",
    )
    assert old_password_login.status_code == 200
    access_token = old_password_login.json()["access_token"]
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")
    assert client.get("/api/v1/auth/me/").json()["email"] == "ada@example.com"

    change_response = client.post(
        "/api/v1/auth/password/change/",
        {
            "current_password": "StrongPassword123!",
            "password": "NewStrongPassword123!",
            "password_confirmation": "NewStrongPassword123!",
        },
        format="json",
    )
    assert change_response.status_code == 200

    client.credentials()
    reset_request = client.post(
        "/api/v1/auth/password/reset/request/",
        {"email": "ada@example.com"},
        format="json",
    )
    assert reset_request.status_code == 200
    assert len(mail.outbox) == 1
    reset_url = reset_request.json()["reset_url"]
    token = parse_qs(urlparse(reset_url).query)["reset_token"][0]

    reset_response = client.post(
        "/api/v1/auth/password/reset/confirm/",
        {
            "token": token,
            "password": "ResetStrongPassword123!",
            "password_confirmation": "ResetStrongPassword123!",
        },
        format="json",
    )
    assert reset_response.status_code == 200

    reused_response = client.post(
        "/api/v1/auth/password/reset/confirm/",
        {
            "token": token,
            "password": "AnotherStrongPassword123!",
            "password_confirmation": "AnotherStrongPassword123!",
        },
        format="json",
    )
    assert reused_response.status_code == 400

    new_login = client.post(
        "/api/v1/auth/login/",
        {"email": "ada@example.com", "password": "ResetStrongPassword123!"},
        format="json",
    )
    assert new_login.status_code == 200


@pytest.mark.django_db
def test_password_reset_does_not_reveal_unknown_email():
    response = APIClient().post(
        "/api/v1/auth/password/reset/request/",
        {"email": "unknown@example.com"},
        format="json",
    )

    assert response.status_code == 200
    assert "reset_url" not in response.json()


@pytest.mark.django_db
def test_dev_token_is_rejected_when_debug_is_disabled(settings):
    settings.DEBUG = False
    response = APIClient().get(
        "/api/v1/tasks/",
        HTTP_AUTHORIZATION="Bearer dev-token",
    )

    assert response.status_code == 401


@pytest.mark.django_db
def test_password_validation_rejects_weak_registration():
    response = APIClient().post(
        "/api/v1/auth/register/",
        {
            "email": "weak@example.com",
            "password": "12345678",
            "password_confirmation": "12345678",
        },
        format="json",
    )

    assert response.status_code == 400
    assert not UserAccount.objects.filter(email="weak@example.com").exists()
