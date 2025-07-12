import swisseph as swe
# Refined version of dashboard/views.py

from django.shortcuts import render, redirect
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import Profile
from authentication.forms import ProfileForm
from core.astrology_utils import (
    get_planet_positions, get_nakshatra,
    calculate_lagna, get_birth_chart_data,
    format_deg, get_rasi_lord, get_sign_name, get_nakshatra_lord,
    calculate_navamsa_chart, get_house_placements
)
import datetime


class DashboardView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'dashboard/dashboard_page.html')


class MyChartView(LoginRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        user = request.user

        try:
            profile = user.profile

            # Ensure all required birth data is available
            if not all([profile.birth_date, profile.birth_time, profile.latitude, profile.longitude]):
                return render(request, 'dashboard/mychart_page.html', {
                    "error": "Please complete your birth details in the profile page."
                })

            # Convert to UTC for calculations
            dt = datetime.datetime.combine(profile.birth_date, profile.birth_time)
            dt_utc = dt - datetime.timedelta(hours=5, minutes=30)
            jd = swe.julday(dt_utc.year, dt_utc.month, dt_utc.day, dt_utc.hour + dt_utc.minute / 60.0)

            # Ephemeris setup
            swe.set_ephe_path('core/ephe/')
            swe.set_sid_mode(swe.SIDM_LAHIRI)

            # Get planet positions
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
            chart["Navamsa"] = [
                {
                    "name": planet,
                    "navamsa_rasi": nav_rasi,
                    "rasi_lord": get_rasi_lord(nav_rasi),
                }
                for planet, nav_rasi in calculate_navamsa_chart(positions).items()
            ]

            # Bhava chart: use string keys so the template can access them
            bhava_chart = {str(i): [] for i in range(1, 13)}
            for planet, house in get_house_placements(positions, asc_deg).items():
                bhava_chart[str(house)].append(planet)

            chart["Bhava"] = bhava_chart

            # Planets including Ascendant
            chart["Planets"] = [
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
                chart["Planets"].append({
                    "name": name,
                    "degree": format_deg(deg),
                    "rasi": rasi,
                    "rasi_lord": get_rasi_lord(rasi),
                    "nakshatra": nak,
                    "nakshatra_lord": get_nakshatra_lord(nak),
                })

            chart.update({
                "Lagna": lagna_sign,
                "Nakshatra": nakshatra
            })

            

            return render(request, 'dashboard/mychart_page.html', {
                "chart_data": chart,
                "lagna_rasi": lagna_sign,
                "nakshatra": nakshatra,
                "navamsa_data": chart["Navamsa"],
                "bhava_chart": chart["Bhava"],
                'house_numbers': [str(i) for i in range(1, 13)],
                "range_1_13": range(1, 13),
                "error": None
            },)

        except Profile.DoesNotExist:
            return redirect('profile')


class ContactView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'dashboard/contact_page.html')


class ProfileView(LoginRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        form = ProfileForm(instance=request.user.profile)
        return render(request, 'dashboard/profile_page.html', {
            'form': form,
            'user': request.user,
        })

    def post(self, request, *args, **kwargs):
        form = ProfileForm(request.POST, request.FILES, instance=request.user.profile)
        if form.is_valid():
            form.save()
            return redirect('profile_page')
        return render(request, 'dashboard/profile_page.html', {
            'form': form,
            'user': request.user,
        })


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
