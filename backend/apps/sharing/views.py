from django.db.models import Q
from django.utils import timezone
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from apps.accounts.models import UserAccount
from apps.sharing.models import TaskShare
from apps.sharing.serializers import ShareDecisionSerializer, TaskShareSerializer
from apps.sharing.services import SharingService


class TaskShareViewSet(ModelViewSet):
    serializer_class = TaskShareSerializer

    def get_queryset(self):
        return (
            TaskShare.objects.filter(task__deleted_at__isnull=True)
            .filter(Q(recipient=self.request.user) | Q(task__owner=self.request.user))
            .select_related("task", "recipient", "shared_by")
            .order_by("-created_at")
        )

    def get_serializer_class(self):
        if self.action in {"partial_update", "update"}:
            return ShareDecisionSerializer
        return TaskShareSerializer

    def create(self, request, *args, **kwargs):
        payload = request.data.copy()
        if kwargs.get("task_id"):
            payload["task"] = str(kwargs["task_id"])

        serializer = self.get_serializer(data=payload)
        serializer.is_valid(raise_exception=True)
        data = dict(serializer.validated_data)
        recipient_email = data.pop("recipient_email")
        recipient = UserAccount.objects.get(email=recipient_email, is_active=True)
        share = SharingService().share(
            actor=request.user,
            share=TaskShare(**data, recipient=recipient),
        )
        response_serializer = TaskShareSerializer(
            share,
            context=self.get_serializer_context(),
        )
        return Response(response_serializer.data, status=status.HTTP_202_ACCEPTED)

    def update(self, request, *args, **kwargs):
        share = self.get_object()
        if share.recipient_id != request.user.id:
            raise PermissionDenied("Only the recipient can accept or reject this invitation.")

        partial = kwargs.pop("partial", False)
        serializer = self.get_serializer(share, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save(responded_at=timezone.now())

        response_serializer = TaskShareSerializer(
            share,
            context=self.get_serializer_context(),
        )
        return Response(response_serializer.data)

    def perform_destroy(self, instance):
        SharingService().cancel(actor=self.request.user, share=instance)
