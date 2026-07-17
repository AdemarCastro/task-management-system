from django.db.models import Q
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from apps.tasks.filters import TaskFilter
from apps.tasks.models import Task
from apps.tasks.permissions import CanAccessTask
from apps.tasks.serializers import TaskSerializer
from apps.tasks.services import TaskService


class TaskViewSet(ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [CanAccessTask]
    filterset_class = TaskFilter
    search_fields = ["title", "description"]
    ordering_fields = ["created_at", "updated_at", "due_at", "priority"]
    ordering = ["-created_at"]

    def get_queryset(self):
        return (
            Task.objects.filter(deleted_at__isnull=True)
            .filter(
                Q(owner=self.request.user)
                | Q(shares__recipient=self.request.user, shares__status="accepted")
            )
            .distinct()
        )

    def perform_create(self, serializer):
        task = TaskService().create(user=self.request.user, data=serializer.validated_data)
        serializer.instance = task

    def perform_update(self, serializer):
        task = TaskService().update(
            user=self.request.user,
            task=self.get_object(),
            data=serializer.validated_data,
        )
        serializer.instance = task

    def perform_destroy(self, instance):
        TaskService().soft_delete(user=self.request.user, task=instance)

    @action(detail=True, methods=["patch"])
    def complete(self, request, pk=None):
        task = TaskService().complete(user=request.user, task=self.get_object())
        return Response(self.get_serializer(task).data)

    @action(detail=True, methods=["patch"])
    def reopen(self, request, pk=None):
        task = TaskService().reopen(user=request.user, task=self.get_object())
        return Response(self.get_serializer(task).data)
