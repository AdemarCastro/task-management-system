from __future__ import annotations

import hashlib
import secrets
from urllib.parse import quote

import jwt
from django.conf import settings
from django.core.mail import send_mail
from django.db import transaction
from django.utils import timezone

from apps.accounts.models import PasswordResetToken, UserAccount


def issue_access_token(user: UserAccount) -> str:
    now = timezone.now()
    expires_at = now + timezone.timedelta(minutes=settings.LOCAL_AUTH_TOKEN_LIFETIME_MINUTES)
    payload = {
        "sub": str(user.id),
        "email": user.email,
        "name": user.name,
        "token_use": "access",
        "auth_source": "local",
        "iss": settings.LOCAL_AUTH_ISSUER,
        "iat": now,
        "exp": expires_at,
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


def authenticate_user(*, email: str, password: str) -> UserAccount | None:
    user = UserAccount.objects.filter(email=email.lower(), is_active=True).first()
    if not user or not user.check_password(password):
        return None

    user.last_login = timezone.now()
    user.save(update_fields=["last_login", "updated_at"])
    return user


def create_password_reset(*, user: UserAccount) -> str:
    raw_token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
    expires_at = timezone.now() + timezone.timedelta(
        minutes=settings.PASSWORD_RESET_TIMEOUT_MINUTES
    )

    PasswordResetToken.objects.filter(user=user, used_at__isnull=True).update(
        used_at=timezone.now()
    )
    PasswordResetToken.objects.create(
        user=user,
        token_hash=token_hash,
        expires_at=expires_at,
    )

    reset_url = f"{settings.FRONTEND_PUBLIC_URL.rstrip('/')}/?reset_token={quote(raw_token)}"
    send_mail(
        subject="Redefinicao de senha - Task Management System",
        message=(
            "Recebemos uma solicitacao para redefinir sua senha. "
            f"Acesse este link para continuar: {reset_url}\n\n"
            "O link expira em "
            f"{settings.PASSWORD_RESET_TIMEOUT_MINUTES} minutos."
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )
    return reset_url


@transaction.atomic
def confirm_password_reset(*, raw_token: str, new_password: str) -> UserAccount:
    token_hash = hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
    reset_token = (
        PasswordResetToken.objects.select_for_update()
        .select_related("user")
        .filter(token_hash=token_hash)
        .first()
    )
    if not reset_token or not reset_token.is_valid():
        raise ValueError("Invalid or expired password reset token.")

    user = reset_token.user
    user.set_password(new_password)
    user.save(update_fields=["password", "updated_at"])
    reset_token.used_at = timezone.now()
    reset_token.save(update_fields=["used_at"])
    return user
