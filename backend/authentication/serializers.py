from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import Profile
from core.astrology_utils import (
    get_planet_positions,
    get_nakshatra,
    calculate_lagna,
    get_birth_chart_data,
)
from grahastra.utility import get_coordinates_from_place, send_email
import threading
from datetime import datetime, timedelta
import swisseph as swe

User = get_user_model()

# -------------------------------
# LOGIN SERIALIZER
# -------------------------------
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            raise serializers.ValidationError("Both email and password are required.")

        user = authenticate(email=email, password=password)
        if not user:
            raise serializers.ValidationError("Invalid email or password.")

        if not user.is_active:
            raise serializers.ValidationError("User account is disabled.")

        data["user"] = user
        return data


# -------------------------------
# SIGNUP SERIALIZER
# -------------------------------
class SignupSerializer(serializers.Serializer):
    fullName = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, validators=[validate_password])
    confirmPassword = serializers.CharField(write_only=True)
    gender = serializers.CharField()
    dob = serializers.DateField(input_formats=["%Y-%m-%d"])
    tob = serializers.TimeField(input_formats=["%H:%M"])
    pob = serializers.CharField()

    def validate(self, attrs):
        # Check password match
        if attrs["password"] != attrs["confirmPassword"]:
            raise serializers.ValidationError({"password": "Passwords do not match"})

        # Check duplicate email
        if User.objects.filter(email=attrs["email"]).exists():
            raise serializers.ValidationError({"email": "Email already registered"})

        return attrs

    def create(self, validated_data):
        full_name = validated_data["fullName"]
        first_name, last_name = (full_name.split(" ", 1) + [""])[:2]

        # Create user
        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=first_name,
            last_name=last_name,
        )

        # -------------------------------
        # Astrology calculations
        # -------------------------------
        dob_str = validated_data["dob"].strftime("%Y-%m-%d")
        tob_str = validated_data["tob"].strftime("%H:%M")

        lat, lng = get_coordinates_from_place(validated_data["pob"])
        positions = get_planet_positions(dob_str, tob_str, lat, lng)
        nakshatra = get_nakshatra(positions["Moon"])

        jd = datetime.combine(validated_data["dob"], validated_data["tob"])
        jd_utc = jd - timedelta(hours=5, minutes=30)  # convert IST → UTC
        ut_hour = jd_utc.hour + jd_utc.minute / 60.0
        julian_day = swe.julday(jd_utc.year, jd_utc.month, jd_utc.day, ut_hour)

        asc_deg, lagna_rasi = calculate_lagna(julian_day, lat, lng)
        chart = get_birth_chart_data(positions, nakshatra, asc_deg)

        # Create profile
        Profile.objects.create(
            user=user,
            gender=validated_data["gender"],
            birth_date=validated_data["dob"],
            birth_time=validated_data["tob"],
            birth_place=validated_data["pob"],
            latitude=lat,
            longitude=lng,
            nakshatra=nakshatra,
            lagna=lagna_rasi,
            yogas="\n".join(chart["Yogas"]),
        )

        # -------------------------------
        # Send welcome email (async)
        # -------------------------------
        subject = "Welcome to Grahastra ✨"
        template = "email/registration_success_email.html"
        context = {
            "name": full_name,
            "email": validated_data["email"],
            "year": datetime.now().year,
        }
        thread = threading.Thread(
            target=send_email, args=(subject, user.email, template, context)
        )
        thread.start()

        return user
