from django.shortcuts import render
from django.views import View

# Create your views here.

class DashboardView(View):

    def get(self,request,*args,**kwargs):

        return render(request,'dashboard/dashboard_page.html')
    

class MyChartView(View):

    def get(self,request,*args,**kwargs):

         return render(request,'dashboard/mychart_page.html')
    

class ContactView(View):

    def get(self,request,*args,**kwargs):

         return render(request,'dashboard/contact_page.html')