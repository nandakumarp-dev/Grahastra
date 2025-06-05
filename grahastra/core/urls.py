from django.urls import path
from .views import landing_page, Landing_Home

urlpatterns = [
    path('landing/', landing_page, name='landing'),
    path('',Landing_Home.as_view(),name='Landin_home')

]