from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.accounts.models import UserAccount
from apps.categories.models import Category
from apps.sharing.models import SharePermission, TaskShare
from apps.tasks.models import Task, TaskPriority


class Command(BaseCommand):
    help = "Create deterministic local demo data for the task management flow."

    def handle(self, *args, **options):
        owner, _ = UserAccount.objects.update_or_create(
            cognito_sub="demo-owner",
            defaults={"email": "owner@example.com", "name": "Demo Owner"},
        )
        recipient, _ = UserAccount.objects.update_or_create(
            cognito_sub="demo-recipient",
            defaults={"email": "recipient@example.com", "name": "Demo Recipient"},
        )
        category, _ = Category.objects.update_or_create(
            owner=owner,
            name="Delivery",
            defaults={"color": "#2563EB"},
        )
        task, _ = Task.objects.update_or_create(
            owner=owner,
            title="Prepare technical assessment delivery",
            defaults={
                "category": category,
                "description": "Validate Docker, tests, CI and delivery documentation.",
                "priority": TaskPriority.HIGH,
                "due_at": timezone.now() + timezone.timedelta(days=2),
            },
        )
        TaskShare.objects.update_or_create(
            task=task,
            recipient=recipient,
            defaults={"shared_by": owner, "permission": SharePermission.EDITOR},
        )

        self.stdout.write(self.style.SUCCESS("Demo data created."))
