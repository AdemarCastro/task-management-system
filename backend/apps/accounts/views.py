from django.conf import settings
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from apps.accounts.models import UserAccount
from apps.accounts.serializers import (
    LoginSerializer,
    PasswordChangeSerializer,
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
    RegisterSerializer,
    UserSerializer,
)
from apps.accounts.services import (
    authenticate_user,
    confirm_password_reset,
    create_password_reset,
    issue_access_token,
)


def token_response(user):
    return {
        "access_token": issue_access_token(user),
        "token_type": "Bearer",
        "expires_in": settings.LOCAL_AUTH_TOKEN_LIFETIME_MINUTES * 60,
        "user": UserSerializer(user).data,
    }


class PublicAuthView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth"


class RegisterView(PublicAuthView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = UserAccount(
            email=serializer.validated_data["email"],
            name=serializer.validated_data.get("name", ""),
        )
        user.cognito_sub = f"local:{user.id}"
        user.set_password(serializer.validated_data["password"])
        user.save()
        return Response(token_response(user), status=status.HTTP_201_CREATED)


class LoginView(PublicAuthView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate_user(**serializer.validated_data)
        if not user:
            return Response(
                {"error": {"code": "invalid_credentials", "message": "Invalid email or password."}},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        return Response(token_response(user))


class PasswordResetRequestView(PublicAuthView):
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = UserAccount.objects.filter(
            email=serializer.validated_data["email"],
            is_active=True,
        ).first()
        response_data = {
            "detail": "If an account exists, password reset instructions were sent by email."
        }
        if user:
            reset_url = create_password_reset(user=user)
            if settings.DEBUG:
                response_data["reset_url"] = reset_url
        return Response(response_data)


class PasswordResetConfirmView(PublicAuthView):
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            user = confirm_password_reset(
                raw_token=serializer.validated_data["token"],
                new_password=serializer.validated_data["password"],
            )
        except ValueError as exc:
            return Response(
                {"error": {"code": "invalid_reset_token", "message": str(exc)}},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(token_response(user))


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class PasswordChangeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        if not request.user.check_password(serializer.validated_data["current_password"]):
            return Response(
                {"error": {"code": "invalid_password", "message": "Current password is invalid."}},
                status=status.HTTP_400_BAD_REQUEST,
            )
        request.user.set_password(serializer.validated_data["password"])
        request.user.save(update_fields=["password", "updated_at"])
        return Response({"detail": "Password changed successfully."})


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, _request):
        return Response({"detail": "Logged out successfully."})
