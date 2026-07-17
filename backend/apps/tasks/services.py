from django.db import transaction

from apps.audit.models import AuditLog
from apps.integrations.holidays import HolidayClient
from apps.tasks.models import Task


class TaskService:
    def __init__(self, holiday_client: HolidayClient | None = None):
        self.holiday_client = holiday_client or HolidayClient()

    def create(self, *, user, data: dict) -> Task:
        data["holiday_warning"] = self._holiday_warning(data.get("due_at"))
        with transaction.atomic():
            task = Task.objects.create(owner=user, **data)
            AuditLog.objects.create(actor=user, task=task, action="task.created", changes={})
            return task

    def update(self, *, user, task: Task, data: dict) -> Task:
        if "due_at" in data:
            data["holiday_warning"] = self._holiday_warning(data.get("due_at"))

        with transaction.atomic():
            for field, value in data.items():
                setattr(task, field, value)
            task.version += 1
            task.save()
            AuditLog.objects.create(actor=user, task=task, action="task.updated", changes=data)
            return task

    def complete(self, *, user, task: Task) -> Task:
        with transaction.atomic():
            task.complete()
            task.save(update_fields=["status", "version", "updated_at"])
            AuditLog.objects.create(actor=user, task=task, action="task.completed", changes={})
            return task

    def reopen(self, *, user, task: Task) -> Task:
        with transaction.atomic():
            task.reopen()
            task.save(update_fields=["status", "version", "updated_at"])
            AuditLog.objects.create(actor=user, task=task, action="task.reopened", changes={})
            return task

    def soft_delete(self, *, user, task: Task) -> None:
        with transaction.atomic():
            task.soft_delete()
            task.save(update_fields=["deleted_at", "version", "updated_at"])
            AuditLog.objects.create(actor=user, task=task, action="task.deleted", changes={})

    def _holiday_warning(self, due_at) -> str:
        if not due_at:
            return ""
        holiday = self.holiday_client.get_national_holiday(due_at.date())
        return f"Prazo cai no feriado: {holiday['name']}" if holiday else ""
