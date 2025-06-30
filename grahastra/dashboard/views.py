from django.shortcuts import render
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render, redirect
from django.views import View
from .models import Profile
import datetime
import swisseph as swe
from core.astrology_utils import (
    get_planet_positions, get_nakshatra,
    calculate_lagna, get_birth_chart_data,
    format_deg, get_rasi_lord, get_sign_name, get_nakshatra_lord,
    calculate_navamsa_chart,get_house_placements,
)


# Create your views here.


class DashboardView(View):

    def get(self,request,*args,**kwargs):

        return render(request,'dashboard/dashboard_page.html')
    

class MyChartView(LoginRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        user = request.user

        try:
            profile = user.profile
            if not profile.birth_date or not profile.birth_time or not profile.latitude or not profile.longitude:
                return render(request, 'dashboard/mychart_page.html', {
                    "error": "Please complete your birth details in the profile page."
                })

            # Date & Time setup
            dt = datetime.datetime.combine(profile.birth_date, profile.birth_time)
            dt_utc = dt - datetime.timedelta(hours=5, minutes=30)
            jd = swe.julday(dt_utc.year, dt_utc.month, dt_utc.day, dt_utc.hour + dt_utc.minute / 60.0)

            # Get lat/lon and formatted strings
            date_str = profile.birth_date.strftime('%Y-%m-%d')
            time_str = profile.birth_time.strftime('%H:%M')
            lat = profile.latitude
            lon = profile.longitude

            # Ephemeris setup
            swe.set_ephe_path('core/ephe/')
            swe.set_sid_mode(swe.SIDM_LAHIRI)

            # Planet positions and calculations
            positions = get_planet_positions(date_str, time_str, lat, lon)
            asc_deg, lagna_sign = calculate_lagna(jd, lat, lon)
            nakshatra = get_nakshatra(positions["Moon"])
            chart = get_birth_chart_data(positions, nakshatra, asc_deg)

            # Calculate Navamsa (D9) chart
            navamsa_data = calculate_navamsa_chart(positions)
            chart["Navamsa"] = []

            for planet, navamsa_rasi in navamsa_data.items():
                chart["Navamsa"].append({
                    "name": planet,
                    "navamsa_rasi": navamsa_rasi,
                    "rasi_lord": get_rasi_lord(navamsa_rasi),
                })

            
            # Prepare Bhava (House-wise) chart
            house_placements = get_house_placements(positions, asc_deg)

            bhava_chart = {i: [] for i in range(1, 13)}  # 1 to 12 houses

            for planet, house in house_placements.items():
                bhava_chart[house].append(planet)

            chart["Bhava"] = bhava_chart


            # Planetary Table
            chart["Planets"] = []

            chart["Planets"].append({
                "name": "Ascendant",
                "degree": format_deg(asc_deg),
                "rasi": lagna_sign,
                "rasi_lord": get_rasi_lord(lagna_sign),
                "nakshatra": get_nakshatra(asc_deg),
                "nakshatra_lord": get_nakshatra_lord(get_nakshatra(asc_deg)),
            })

            planet_names = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]
            for name in planet_names:
                deg = positions.get(name)
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

            chart["Lagna"] = lagna_sign
            chart["Nakshatra"] = nakshatra

            return render(request, 'dashboard/mychart_page.html', {
                "chart_data": chart,
                "lagna_rasi": lagna_sign,
                "nakshatra": nakshatra,
                "navamsa_data": chart["Navamsa"],
                "bhava_chart": chart["Bhava"],
                "error": None
            })

        except Profile.DoesNotExist:
            return redirect('profile')
    

class ContactView(View):

    def get(self,request,*args,**kwargs):

         return render(request,'dashboard/contact_page.html')
    

class ProfileView(View):

    def get(self,request,*args,**kwargs):

         return render(request,'dashboard/profile_page.html')
    
class YogasView(View):

    def get(self,request,*args,**kwargs):

        return render(request,'dashboard/yogas_page.html')