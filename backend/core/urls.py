from django.urls import path
from .views import Landing_Home

urlpatterns = [
    
    path('',Landing_Home.as_view(),name='Landing_page')

]