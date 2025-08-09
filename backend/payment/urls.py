from django.urls import path
from .views import PremiumUpgradeView, PremiumPaymentView, VerifyPremiumPaymentView

urlpatterns = [
    path('premium/', PremiumUpgradeView.as_view(), name='premium_upgrade'),
    path('premium/pay/<str:plan>/', PremiumPaymentView.as_view(), name='premium_pay'),
    path('premium/verify/', VerifyPremiumPaymentView.as_view(), name='premium_verify'),
]