from django.urls import path
from . import views

urlpatterns = [
    
    path('dashboard/',views.DashboardView.as_view(), name='dashboard_page'),
    path('mychart/',views.MyChartView.as_view(), name='mychart_page'),
    path('contact/',views.ContactView.as_view(), name='contact_page'),
    path('ask_astrology/',views.AskAstrologyView.as_view(), name='ask_astrology_page'),
    path('profile/',views.ProfileView.as_view(), name='profile_page'),
    path('yogas/',views.YogasView.as_view(), name='yogas_page'),

]