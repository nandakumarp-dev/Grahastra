from django.shortcuts import render,redirect
from django.views import View
from django.contrib.auth import get_user_model ,logout
User = get_user_model()
from django.contrib.auth.hashers import make_password
from authentication.models import Profile
from django.contrib.auth import authenticate, login
from django.contrib import messages

# Create your views here.

class LoginView(View):
    def get(self, request):
        return render(request, 'authentication/login_page.html')

    def post(self, request):
        email = request.POST.get("email")
        password = request.POST.get("password")
        user = authenticate(request, email=email, password=password)  # Use email

        if user:
            login(request, user)
            return redirect('dashboard_page')
        else:
            return render(request, 'authentication/login_page.html', {
                'error': 'Invalid email or password.'
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

        if User.objects.filter(email=email).exists():
            return render(request, 'authentication/signup_page.html', {'error': "Email already registered."})

        # Split full name
        first_name, last_name = (full_name.split(" ", 1) + [""])[:2]

        user = User.objects.create_user(
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        Profile.objects.create(
            user=user,
            gender=gender,
            birth_date=dob,
            birth_time=tob,
            birth_place=pob
        )

        return redirect('login_page')
    

class LogoutView(View):
    def get(self, request):
        logout(request)
        return redirect('Landin_home')