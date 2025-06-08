from django.shortcuts import render,redirect
from django.views import View
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from authentication.models import Profile
from django.contrib.auth import authenticate, login

# Create your views here.

class LoginView(View):
    def get(self, request):
        return render(request, 'authentication/login_page.html')

    def post(self, request):
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(request, username=username, password=password)

        if user:
            login(request, user)
            return redirect('profile')  # profile page coming up next
        else:
            return render(request, 'authentication/login_page.html', {
                'error': 'Invalid username or password.'
            })
    

class SignUpView(View):
    def get(self, request):
        return render(request, 'authentication/signup_page.html')

    def post(self, request):
        full_name = request.POST.get("fullName")
        email = request.POST.get("email")
        password = request.POST.get("password")
        confirm = request.POST.get("confirmPassword")
        gender = request.POST.get("gender")
        dob = request.POST.get("dob")
        tob = request.POST.get("tob")
        pob = request.POST.get("pob")

        if password != confirm:
            return render(request, 'authentication/signup_page.html', {'error': "Passwords do not match."})

        if User.objects.filter(username=full_name).exists():
            return render(request, 'authentication/signup_page.html', {'error': "Username already exists."})

        user = User.objects.create(
            username=full_name,
            email=email,
            password=make_password(password)
        )

        Profile.objects.create(
            user=user,
            gender=gender,
            birth_date=dob,
            birth_time=tob,
            birth_place=pob
        )

        return redirect('login_page')