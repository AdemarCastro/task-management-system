from django.db import transaction

from apps.audit.models import AuditLog
from apps.integrations.events import TaskEventPublisher
from apps.sharing.models import TaskShare


class SharingService:
    def __init__(self, event_publisher: TaskEventPublisher | None = None):
        self.event_publisher = event_publisher or TaskEventPublisher()

    def share(self, *, actor, share: TaskShare) -> TaskShare:
        if share.task.owner_id != actor.id:
            raise PermissionError("Only the task owner can share this task.")

        with transaction.atomic():
            share.save()
            AuditLog.objects.create(
                actor=actor,
                task=share.task,
                action="task.shared",
                changes={"recipient": share.recipient.email, "permission": share.permission},
            )
            transaction.on_commit(lambda: self.event_publisher.publish_task_shared(share))
        return share
