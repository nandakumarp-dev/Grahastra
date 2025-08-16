from django.urls import path
from . import views

urlpatterns = [
    
    path('dashboard/',views.DashboardView.as_view(), name='dashboard_page'),
    path('mychart/',views.MyChartAPI.as_view(), name='mychart_page'),
    path('contact/',views.ContactView.as_view(), name='contact_page'), 
    # path('profile/',views.ProfileView.as_view(), name='profile_page'),
    path('yogas/',views.YogasView.as_view(), name='yogas_page'),

]