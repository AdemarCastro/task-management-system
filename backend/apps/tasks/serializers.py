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
    category_name = serializers.CharField(source="category.name", read_only=True)
    access_role = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = [
            "id",
            "category",
            "category_name",
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
        read_only_fields = [
            "id",
            "category_name",
            "status",
            "holiday_warning",
            "version",
            "created_at",
            "updated_at",
            "access_role",
        ]

    def validate_category(self, category):
        request = self.context["request"]

        if self.instance and self.instance.owner_id != request.user.id:
            if category is None and self.instance.category_id is None:
                return category
            if category and category.id == self.instance.category_id:
                return category
            raise serializers.ValidationError(
                "Only the task owner can change its category."
            )

        if category and category.owner_id != request.user.id:
            raise serializers.ValidationError(
                "Category does not belong to the task owner."
            )
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
