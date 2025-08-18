# urls.py
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import MyChartAPI

urlpatterns = [
    path("mychart/", MyChartAPI.as_view(), name="mychart"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]