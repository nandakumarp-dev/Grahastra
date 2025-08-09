from django.urls import path
from . import views
from .views import clear_astro_chats

urlpatterns = [
    
    path('ask_astrology/',views.AskAstrologyView.as_view(), name='ask_astrology'),
    path("clear_chats/", clear_astro_chats, name="clear_astro_chats"),

]