import uuid

from django.contrib.auth.hashers import check_password, make_password
from django.db import models
from django.utils import timezone


class UserAccount(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cognito_sub = models.CharField(max_length=128, unique=True)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=160, blank=True)
    password = models.CharField(max_length=128, default="!")
    is_active = models.BooleanField(default=True)
    last_login = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.email

    @property
    def is_authenticated(self) -> bool:
        return True

    def set_password(self, raw_password: str) -> None:
        self.password = make_password(raw_password)

    def check_password(self, raw_password: str) -> bool:
        return check_password(raw_password, self.password)


class PasswordResetToken(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        UserAccount,
        on_delete=models.CASCADE,
        related_name="password_reset_tokens",
    )
    token_hash = models.CharField(max_length=64, unique=True)
    expires_at = models.DateTimeField()
    used_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(
                fields=["user", "expires_at"],
                name="accounts_pa_user_id_5b11d7_idx",
            )
        ]

    def __str__(self) -> str:
        return f"Password reset for {self.user_id}"

    def is_valid(self) -> bool:
        return self.used_at is None and self.expires_at > timezone.now()
