from __future__ import annotations

from dataclasses import dataclass
from uuid import UUID

import jwt
import requests
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import authentication, exceptions

from apps.accounts.models import UserAccount


@dataclass(frozen=True)
class CognitoClaims:
    sub: str
    email: str
    name: str


class CognitoJWTAuthentication(authentication.BaseAuthentication):
    """Validates Cognito access tokens.

    In local development, when Cognito is not configured, a Bearer dev-token creates
    a deterministic user. This keeps Docker onboarding fast without weakening prod.
    """

    keyword = "Bearer"

    def authenticate_header(self, _request):
        return self.keyword

    def authenticate(self, request):
        header = authentication.get_authorization_header(request).decode("utf-8")
        if not header:
            return None

        try:
            keyword, token = header.split(" ", maxsplit=1)
        except ValueError as exc:
            raise exceptions.AuthenticationFailed("Invalid authorization header.") from exc

        if keyword != self.keyword:
            return None

        claims = self._claims_from_token(token)
        user, _created = UserAccount.objects.update_or_create(
            cognito_sub=claims.sub,
            defaults={"email": claims.email, "name": claims.name},
        )
        return user, None

    def _claims_from_token(self, token: str) -> CognitoClaims:
        if token == "dev-token" and settings.DEBUG and not settings.COGNITO_USER_POOL_ID:
            return CognitoClaims(
                sub="local-dev-user",
                email="dev@example.com",
                name="Local Developer",
            )

        try:
            local_payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=["HS256"],
                issuer=settings.LOCAL_AUTH_ISSUER,
            )
        except jwt.PyJWTError:
            local_payload = None

        if local_payload and local_payload.get("auth_source") == "local":
            if local_payload.get("token_use") != "access":
                raise exceptions.AuthenticationFailed("Invalid token_use.")
            try:
                user = UserAccount.objects.get(
                    id=UUID(local_payload["sub"]),
                    is_active=True,
                )
            except (ObjectDoesNotExist, ValueError, KeyError) as exc:
                raise exceptions.AuthenticationFailed("Invalid or expired token.") from exc
            return CognitoClaims(sub=user.cognito_sub, email=user.email, name=user.name)

        if not settings.COGNITO_JWKS_URL:
            raise exceptions.AuthenticationFailed("Cognito is not configured.")

        try:
            jwks_client = jwt.PyJWKClient(settings.COGNITO_JWKS_URL, cache_keys=True)
            signing_key = jwks_client.get_signing_key_from_jwt(token)
            payload = jwt.decode(
                token,
                signing_key.key,
                algorithms=["RS256"],
                issuer=settings.COGNITO_ISSUER,
                options={"verify_aud": False},
            )
        except (jwt.PyJWTError, requests.RequestException) as exc:
            raise exceptions.AuthenticationFailed("Invalid or expired token.") from exc

        client_id = payload.get("client_id") or payload.get("aud")
        if settings.COGNITO_APP_CLIENT_ID and client_id != settings.COGNITO_APP_CLIENT_ID:
            raise exceptions.AuthenticationFailed("Token audience is not allowed.")

        if payload.get("token_use") != "access":
            raise exceptions.AuthenticationFailed("Invalid token_use.")

        return CognitoClaims(
            sub=payload["sub"],
            email=payload.get("email", f"{payload['sub']}@unknown.local"),
            name=payload.get("name", ""),
        )
