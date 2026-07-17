from rest_framework import serializers

from apps.categories.models import Category
from apps.sharing.models import ShareStatus, TaskShare
from apps.tasks.models import Task


class TaskSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        allow_null=True,
        required=False,
    )
    access_role = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = [
            "id",
            "category",
            "title",
            "description",
            "status",
            "priority",
            "due_at",
            "holiday_warning",
            "version",
            "created_at",
            "updated_at",
            "access_role",
        ]
        read_only_fields = ["id", "holiday_warning", "version", "created_at", "updated_at"]

    def validate_category(self, category):
        request = self.context["request"]
        if category and category.owner_id != request.user.id:
            raise serializers.ValidationError("Category does not belong to the current user.")
        return category

    def get_access_role(self, task):
        request = self.context.get("request")
        if not request or task.owner_id == request.user.id:
            return "owner"

        share = TaskShare.objects.filter(
            task=task,
            recipient=request.user,
            status=ShareStatus.ACCEPTED,
        ).first()
        return share.permission if share else None
