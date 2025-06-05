from django.shortcuts import render

from django.views import View

# Create your views here.


class LoginView(View):

    def get(self,request,*args,**kwargs):

        return render(request,'authentication/login_page.html')
    

class SignUpView(View):

    def get(self,request,*args,**kwargs):

        return render(request,'authentication/signup_page.html')