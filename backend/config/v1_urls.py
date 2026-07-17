from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.categories.views import CategoryViewSet
from apps.sharing.views import TaskShareViewSet
from apps.tasks.views import TaskViewSet

router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="category")
router.register("tasks", TaskViewSet, basename="task")
router.register("shares", TaskShareViewSet, basename="share")

urlpatterns = [path("", include(router.urls))]
