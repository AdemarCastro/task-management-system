from rest_framework import serializers

from apps.accounts.models import UserAccount
from apps.sharing.models import ShareStatus, TaskShare


class TaskShareSerializer(serializers.ModelSerializer):
    recipient_email = serializers.EmailField(write_only=True, required=False)

    class Meta:
        model = TaskShare
        fields = ["id", "task", "recipient", "recipient_email", "permission", "status", "created_at"]
        read_only_fields = ["id", "recipient", "status", "created_at"]

    def validate_recipient_email(self, value):
        if not UserAccount.objects.filter(email=value).exists():
            raise serializers.ValidationError("Recipient must sign in once before being invited.")
        return value

    def create(self, validated_data):
        email = validated_data.pop("recipient_email")
        validated_data["recipient"] = UserAccount.objects.get(email=email)
        return super().create(validated_data)


class ShareDecisionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskShare
        fields = ["status"]

    def validate_status(self, value):
        if value not in {ShareStatus.ACCEPTED, ShareStatus.REJECTED}:
            raise serializers.ValidationError("Use accepted or rejected.")
        return value
