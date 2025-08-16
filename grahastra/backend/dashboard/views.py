import swisseph as swe
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import render, redirect
from django.views import View
from rest_framework.views import APIView
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import Profile
import datetime
from core.astrology_utils import (
    get_planet_positions, get_nakshatra,
    calculate_lagna, get_birth_chart_data,
    format_deg, get_rasi_lord, get_sign_name, get_nakshatra_lord,
    calculate_navamsa_chart, get_house_placements
)
from .serializers import ProfileSerializer, PlanetSerializer, NavamsaSerializer, BhavaChartSerializer

class DashboardView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'dashboard/dashboard_page.html')


class MyChartAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        try:
            profile = user.profile
        except Profile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=404)

        # ensure required data
        if not all([profile.birth_date, profile.birth_time, profile.latitude, profile.longitude]):
            return Response({"error": "Please complete your birth details in the profile page."}, status=400)

        # Convert to UTC
        dt = datetime.datetime.combine(profile.birth_date, profile.birth_time)
        dt_utc = dt - datetime.timedelta(hours=5, minutes=30)
        jd = swe.julday(dt_utc.year, dt_utc.month, dt_utc.day, dt_utc.hour + dt_utc.minute / 60.0)

        # Ephemeris setup
        swe.set_ephe_path('core/ephe/')
        swe.set_sid_mode(swe.SIDM_LAHIRI)

        # Planet positions
        positions = get_planet_positions(
            profile.birth_date.strftime('%Y-%m-%d'),
            profile.birth_time.strftime('%H:%M'),
            profile.latitude,
            profile.longitude
        )

        # Lagna & Nakshatra
        asc_deg, lagna_sign = calculate_lagna(jd, profile.latitude, profile.longitude)
        nakshatra = get_nakshatra(positions["Moon"])

        chart = get_birth_chart_data(positions, nakshatra, asc_deg)

        # Navamsa chart
        navamsa = [
            {"name": planet, "navamsa_rasi": nav_rasi, "rasi_lord": get_rasi_lord(nav_rasi)}
            for planet, nav_rasi in calculate_navamsa_chart(positions).items()
        ]

        # Bhava chart
        bhava_chart = {str(i): [] for i in range(1, 13)}
        for planet, house in get_house_placements(positions, asc_deg).items():
            bhava_chart[str(house)].append(planet)

        # Planets
        planets = [
            {
                "name": "Ascendant",
                "degree": format_deg(asc_deg),
                "rasi": lagna_sign,
                "rasi_lord": get_rasi_lord(lagna_sign),
                "nakshatra": get_nakshatra(asc_deg),
                "nakshatra_lord": get_nakshatra_lord(get_nakshatra(asc_deg)),
            }
        ]
        for name in ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]:
            deg = positions[name]
            rasi = get_sign_name(deg)
            nak = get_nakshatra(deg)
            planets.append({
                "name": name,
                "degree": format_deg(deg),
                "rasi": rasi,
                "rasi_lord": get_rasi_lord(rasi),
                "nakshatra": nak,
                "nakshatra_lord": get_nakshatra_lord(nak),
            })

        return Response({
            "user": {
                "first_name": user.first_name,
                "last_name": user.last_name,
                "profile": ProfileSerializer(profile).data,
            },
            "chart": {
                "Lagna": lagna_sign,
                "Nakshatra": nakshatra,
                "Planets": PlanetSerializer(planets, many=True).data,
                "Navamsa": NavamsaSerializer(navamsa, many=True).data,
                "Bhava": bhava_chart,
            }
        })


class ContactView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'dashboard/contact_page.html')


# class ProfileView(LoginRequiredMixin, View):
#     def get(self, request, *args, **kwargs):
#         form = ProfileForm(instance=request.user.profile)
#         return render(request, 'dashboard/profile_page.html', {
#             'form': form,
#             'user': request.user,
#         })

#     def post(self, request, *args, **kwargs):
#         form = ProfileForm(request.POST, request.FILES, instance=request.user.profile)
#         if form.is_valid():
#             form.save()
#             return redirect('profile_page')
#         return render(request, 'dashboard/profile_page.html', {
#             'form': form,
#             'user': request.user,
#         })


class YogasView(LoginRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        user = request.user

        try:
            profile = user.profile
            if not all([profile.birth_date, profile.birth_time, profile.latitude, profile.longitude]):
                return render(request, 'dashboard/yogas_page.html', {
                    "error": "Please complete your birth details in the profile page.",
                    "yogas": []
                })

            # Date and JD setup
            dt = datetime.datetime.combine(profile.birth_date, profile.birth_time)
            dt_utc = dt - datetime.timedelta(hours=5, minutes=30)
            jd = swe.julday(dt_utc.year, dt_utc.month, dt_utc.day, dt_utc.hour + dt_utc.minute / 60.0)

            # Ephemeris setup
            swe.set_ephe_path('core/ephe/')
            swe.set_sid_mode(swe.SIDM_LAHIRI)

            # Position and chart data
            positions = get_planet_positions(
                profile.birth_date.strftime('%Y-%m-%d'),
                profile.birth_time.strftime('%H:%M'),
                profile.latitude,
                profile.longitude
            )
            asc_deg, _ = calculate_lagna(jd, profile.latitude, profile.longitude)
            nakshatra = get_nakshatra(positions["Moon"])
            chart = get_birth_chart_data(positions, nakshatra, asc_deg)

            return render(request, 'dashboard/yogas_page.html', {
                "yogas": chart.get("Yogas", []),
                "error": None
            })

        except Profile.DoesNotExist:
            return redirect('profile_page')
