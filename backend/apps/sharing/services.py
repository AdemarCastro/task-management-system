from django.db import transaction
from rest_framework.exceptions import PermissionDenied, ValidationError

from apps.audit.models import AuditLog
from apps.integrations.events import TaskEventPublisher
from apps.sharing.models import TaskShare


class SharingService:
    def __init__(self, event_publisher: TaskEventPublisher | None = None):
        self.event_publisher = event_publisher or TaskEventPublisher()

    def share(self, *, actor, share: TaskShare) -> TaskShare:
        if share.task.owner_id != actor.id:
            raise PermissionDenied("Only the task owner can share this task.")
        if share.task.deleted_at is not None:
            raise ValidationError("Deleted tasks cannot be shared.")
        if share.recipient_id == actor.id:
            raise ValidationError("A task cannot be shared with its owner.")

        with transaction.atomic():
            share.shared_by = actor
            share.save()
            AuditLog.objects.create(
                actor=actor,
                task=share.task,
                action="task.shared",
                changes={"recipient": share.recipient.email, "permission": share.permission},
            )
            transaction.on_commit(lambda: self.event_publisher.publish_task_shared(share))
        return share

    def cancel(self, *, actor, share: TaskShare) -> None:
        if share.task.owner_id != actor.id:
            raise PermissionDenied("Only the task owner can remove this sharing.")

        with transaction.atomic():
            AuditLog.objects.create(
                actor=actor,
                task=share.task,
                action="task.unshared",
                changes={
                    "recipient": share.recipient.email,
                    "permission": share.permission,
                    "status": share.status,
                },
            )
            share.delete()
