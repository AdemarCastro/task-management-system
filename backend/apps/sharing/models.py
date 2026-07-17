import uuid

from django.db import models
from django.utils import timezone


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
    shared_by = models.ForeignKey(
        "accounts.UserAccount",
        on_delete=models.CASCADE,
        related_name="sent_shares",
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
    responded_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["task", "recipient"],
                name="unique_task_share_recipient",
            )
        ]

    def __str__(self) -> str:
        return f"{self.task_id} shared with {self.recipient_id}"

    def accept(self) -> None:
        self.status = ShareStatus.ACCEPTED
        self.responded_at = timezone.now()

    def reject(self) -> None:
        self.status = ShareStatus.REJECTED
        self.responded_at = timezone.now()
