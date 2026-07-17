import uuid

from django.db import models


class SharePermission(models.TextChoices):
    VIEWER = "viewer", "Viewer"
    EDITOR = "editor", "Editor"


class ShareStatus(models.TextChoices):
    PENDING = "pending", "Pending"
    ACCEPTED = "accepted", "Accepted"
    REJECTED = "rejected", "Rejected"


class TaskShare(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    task = models.ForeignKey("tasks.Task", on_delete=models.CASCADE, related_name="shares")
    recipient = models.ForeignKey(
        "accounts.UserAccount",
        on_delete=models.CASCADE,
        related_name="received_shares",
    )
    permission = models.CharField(
        max_length=24,
        choices=SharePermission.choices,
        default=SharePermission.VIEWER,
    )
    status = models.CharField(
        max_length=24,
        choices=ShareStatus.choices,
        default=ShareStatus.PENDING,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["task", "recipient"], name="unique_task_share_recipient")
        ]
