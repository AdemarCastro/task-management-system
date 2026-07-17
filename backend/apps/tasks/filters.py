import django_filters

from apps.tasks.models import Task


class TaskFilter(django_filters.FilterSet):
    due_before = django_filters.IsoDateTimeFilter(field_name="due_at", lookup_expr="lte")
    due_after = django_filters.IsoDateTimeFilter(field_name="due_at", lookup_expr="gte")

    class Meta:
        model = Task
        fields = ["status", "priority", "category", "due_before", "due_after"]
