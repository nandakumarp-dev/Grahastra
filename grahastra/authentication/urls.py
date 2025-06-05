from django.urls import path
from . import views

urlpatterns = [
    path('login/',views.LoginView.as_view(), name='login_page'),
    path('signup/',views.SignUpView.as_view(), name='signup_page'),

]