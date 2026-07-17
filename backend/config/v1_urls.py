from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.accounts.views import (
    LoginView,
    LogoutView,
    MeView,
    PasswordChangeView,
    PasswordResetConfirmView,
    PasswordResetRequestView,
    RegisterView,
)
from apps.categories.views import CategoryViewSet
from apps.sharing.views import TaskShareViewSet
from apps.tasks.views import TaskViewSet

router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="category")
router.register("tasks", TaskViewSet, basename="task")
router.register("shares", TaskShareViewSet, basename="share")

urlpatterns = [path("", include(router.urls))]
urlpatterns += [
    path("auth/register/", RegisterView.as_view(), name="auth-register"),
    path("auth/login/", LoginView.as_view(), name="auth-login"),
    path("auth/me/", MeView.as_view(), name="auth-me"),
    path("auth/logout/", LogoutView.as_view(), name="auth-logout"),
    path("auth/password/change/", PasswordChangeView.as_view(), name="auth-password-change"),
    path(
        "auth/password/reset/request/",
        PasswordResetRequestView.as_view(),
        name="auth-password-reset-request",
    ),
    path(
        "auth/password/reset/confirm/",
        PasswordResetConfirmView.as_view(),
        name="auth-password-reset-confirm",
    ),
    path(
        "tasks/<uuid:task_id>/shares/",
        TaskShareViewSet.as_view({"post": "create"}),
        name="task-shares",
    ),
]
