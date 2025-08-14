from django.contrib.auth import get_user_model, authenticate
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import LoginSerializer, SignupSerializer

User = get_user_model()

def get_tokens_for_user(user):
    """
    Utility function to generate refresh + access tokens
    """
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }

# -------------------------------
# SIGNUP VIEW (JWT-based)
# -------------------------------
class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    user = serializer.save()
                    tokens = get_tokens_for_user(user)

                return Response(
                    {
                        "success": True,
                        "message": "Signup successful",
                        "tokens": tokens,
                    },
                    status=status.HTTP_201_CREATED,
                )
            except Exception as e:
                return Response(
                    {"success": False, "message": f"Signup failed: {str(e)}"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        return Response(
            {"success": False, "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

# -------------------------------
# LOGIN VIEW (JWT-based)
# -------------------------------
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data.get("email")
            password = serializer.validated_data.get("password")

            user = authenticate(request, email=email, password=password)
            if user:
                tokens = get_tokens_for_user(user)
                return Response(
                    {
                        "success": True,
                        "message": "Login successful",
                        "tokens": tokens,
                    },
                    status=status.HTTP_200_OK,
                )

            return Response(
                {"success": False, "message": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        return Response(
            {"success": False, "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

# -------------------------------
# LOGOUT VIEW (JWT blacklist refresh)
# -------------------------------
class LogoutView(APIView):
    """
    Blacklist the refresh token on logout
    """

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {"success": True, "message": "Logout successful"},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {"success": False, "message": f"Logout failed: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )
