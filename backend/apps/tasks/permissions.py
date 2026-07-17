from rest_framework.permissions import SAFE_METHODS, BasePermission

from apps.sharing.models import SharePermission, ShareStatus, TaskShare


class CanAccessTask(BasePermission):
    def has_object_permission(self, request, _view, obj):
        if obj.owner_id == request.user.id:
            return True

        if request.method == "DELETE":
            return False

        share = TaskShare.objects.filter(
            task=obj,
            recipient=request.user,
            status=ShareStatus.ACCEPTED,
        ).first()
        if not share:
            return False

        if request.method in SAFE_METHODS:
            return True

        return share.permission == SharePermission.EDITOR
