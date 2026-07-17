import uuid

from django.db import models
from django.utils import timezone


class TaskStatus(models.TextChoices):
    PENDING = "pending", "Pending"
    COMPLETED = "completed", "Completed"


class TaskPriority(models.TextChoices):
    LOW = "low", "Low"
    MEDIUM = "medium", "Medium"
    HIGH = "high", "High"


class Task(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey("accounts.UserAccount", on_delete=models.CASCADE, related_name="tasks")
    category = models.ForeignKey(
        "categories.Category",
        on_delete=models.SET_NULL,
        related_name="tasks",
        null=True,
        blank=True,
    )
    title = models.CharField(max_length=160)
    description = models.TextField(blank=True)
    status = models.CharField(
        max_length=24,
        choices=TaskStatus.choices,
        default=TaskStatus.PENDING,
    )
    priority = models.CharField(
        max_length=24,
        choices=TaskPriority.choices,
        default=TaskPriority.MEDIUM,
    )
    due_at = models.DateTimeField(null=True, blank=True)
    holiday_warning = models.CharField(max_length=255, blank=True)
    version = models.PositiveIntegerField(default=1)
    deleted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["owner", "status"]),
            models.Index(fields=["owner", "due_at"]),
            models.Index(fields=["owner", "deleted_at"]),
        ]
        ordering = ["-created_at"]

    def complete(self) -> None:
        self.status = TaskStatus.COMPLETED
        self.version += 1

    def reopen(self) -> None:
        self.status = TaskStatus.PENDING
        self.version += 1

    def soft_delete(self) -> None:
        self.deleted_at = timezone.now()
        self.version += 1

    def __str__(self) -> str:
        return self.title
