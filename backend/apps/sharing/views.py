from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from apps.accounts.models import UserAccount
from apps.sharing.models import TaskShare
from apps.sharing.serializers import ShareDecisionSerializer, TaskShareSerializer
from apps.sharing.services import SharingService


class TaskShareViewSet(ModelViewSet):
    serializer_class = TaskShareSerializer

    def get_queryset(self):
        return TaskShare.objects.filter(recipient=self.request.user).select_related("task", "recipient")

    def get_serializer_class(self):
        if self.action in {"partial_update", "update"}:
            return ShareDecisionSerializer
        return TaskShareSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = dict(serializer.validated_data)
        recipient_email = data.pop("recipient_email")
        recipient = UserAccount.objects.get(email=recipient_email)
        share = SharingService().share(
            actor=request.user,
            share=TaskShare(**data, recipient=recipient),
        )
        return Response(TaskShareSerializer(share).data, status=status.HTTP_202_ACCEPTED)
