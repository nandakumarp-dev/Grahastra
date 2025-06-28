from django.shortcuts import render,redirect
from django.views import View
from django.contrib.auth import get_user_model ,logout
User = get_user_model()
from django.contrib.auth.hashers import make_password
from authentication.models import Profile
from django.contrib.auth import authenticate, login
from django.contrib import messages
import threading
import swisseph as swe
from grahastra.utility import send_email
from datetime import datetime, timedelta
from grahastra.utility import get_coordinates_from_place
from core.astrology_utils import get_birth_chart_data, get_house_placements,get_nakshatra,calculate_lagna,get_planet_positions
from django.db import transaction

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
        from django.db import transaction  # can go at the top too

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

        try:
            with transaction.atomic():
                first_name, last_name = (full_name.split(" ", 1) + [""])[:2]

                user = User.objects.create_user(
                    email=email,
                    password=password,
                    first_name=first_name,
                    last_name=last_name
                )

                lat, lng = get_coordinates_from_place(pob)
                positions = get_planet_positions(dob, tob, lat, lng)
                nakshatra = get_nakshatra(positions['Moon'])

                jd = datetime.strptime(dob + ' ' + tob, "%Y-%m-%d %H:%M")
                jd_utc = jd - timedelta(hours=5, minutes=30)
                ut_hour = jd_utc.hour + jd_utc.minute / 60.0
                julian_day = swe.julday(jd_utc.year, jd_utc.month, jd_utc.day, ut_hour)

                asc_deg, lagna_rasi = calculate_lagna(julian_day, lat, lng)
                chart = get_birth_chart_data(positions, nakshatra, asc_deg)

                Profile.objects.create(
                    user=user,
                    gender=gender,
                    birth_date=dob,
                    birth_time=tob,
                    birth_place=pob,
                    latitude=lat,
                    longitude=lng,
                    nakshatra=nakshatra,
                    lagna=lagna_rasi,
                    yogas="\n".join(chart['Yogas'])
                )

        except Exception as e:
            return render(request, 'authentication/signup_page.html', {'error': f"Signup failed: {e}"})

        # Outside transaction (non-critical)
        subject = 'Welcome to Grahastra ✨'
        recipient = user.email
        template = 'email/registration_success_email.html'
        context = {
            'name': full_name,
            'email': email,
            'year': datetime.now().year
        }

        thread = threading.Thread(target=send_email, args=(subject, recipient, template, context))
        thread.start()

        messages.success(request, "Account created! Please log in.")
        return redirect('login_page')
    

class LogoutView(View):
    def get(self, request):
        logout(request)
        return redirect('Landin_home')