from rest_framework import serializers

from apps.accounts.models import UserAccount
from apps.sharing.models import ShareStatus, TaskShare


class TaskShareSerializer(serializers.ModelSerializer):
    recipient_email = serializers.EmailField(write_only=True, required=False)
    recipient_display_email = serializers.EmailField(source="recipient.email", read_only=True)
    task_title = serializers.CharField(source="task.title", read_only=True)
    can_respond = serializers.SerializerMethodField()
    can_cancel = serializers.SerializerMethodField()

    class Meta:
        model = TaskShare
        fields = [
            "id",
            "task",
            "task_title",
            "recipient",
            "recipient_email",
            "recipient_display_email",
            "shared_by",
            "permission",
            "status",
            "created_at",
            "responded_at",
            "can_respond",
            "can_cancel",
        ]
        read_only_fields = [
            "id",
            "recipient",
            "recipient_display_email",
            "shared_by",
            "status",
            "created_at",
            "responded_at",
            "task_title",
            "can_respond",
            "can_cancel",
        ]

    def validate_recipient_email(self, value):
        normalized = value.lower()
        if not UserAccount.objects.filter(email=normalized, is_active=True).exists():
            raise serializers.ValidationError(
                "Recipient must have an active account before being invited."
            )
        return normalized

    def validate(self, attrs):
        request = self.context.get("request")
        if not request or request.method != "POST":
            return attrs

        recipient_email = attrs.get("recipient_email")
        task = attrs.get("task")
        if not recipient_email:
            raise serializers.ValidationError(
                {"recipient_email": "This field is required."}
            )
        if not task or task.deleted_at is not None:
            raise serializers.ValidationError(
                {"task": "Only active tasks can be shared."}
            )

        recipient = UserAccount.objects.get(email=recipient_email, is_active=True)
        if recipient.id == request.user.id:
            raise serializers.ValidationError(
                {"recipient_email": "A task cannot be shared with its owner."}
            )
        if TaskShare.objects.filter(task=task, recipient=recipient).exists():
            raise serializers.ValidationError(
                {"recipient_email": "This task is already shared with this recipient."}
            )
        return attrs

    def get_can_respond(self, share):
        request = self.context.get("request")
        return bool(
            request
            and share.recipient_id == request.user.id
            and share.status == ShareStatus.PENDING
        )

    def get_can_cancel(self, share):
        request = self.context.get("request")
        return bool(request and share.task.owner_id == request.user.id)


class ShareDecisionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskShare
        fields = ["status"]

    def validate_status(self, value):
        if value not in {ShareStatus.ACCEPTED, ShareStatus.REJECTED}:
            raise serializers.ValidationError("Use accepted or rejected.")
        if self.instance and self.instance.status != ShareStatus.PENDING:
            raise serializers.ValidationError("This invitation has already been decided.")
        return value
