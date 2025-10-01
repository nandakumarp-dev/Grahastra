# src- grahastra/dashboard/views.py

import swisseph as swe
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Profile
import datetime
from core.astrology_utils import (
    get_planet_positions, get_nakshatra,
    calculate_lagna, get_birth_chart_data,
    format_deg, get_rasi_lord, get_sign_name, get_nakshatra_lord,
    calculate_navamsa_chart, get_house_placements
)
from .serializers import ProfileSerializer, PlanetSerializer, NavamsaSerializer

class BirthChartAPI(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        try:
            profile = user.profile
        except Profile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

        # ensure required data
        if not all([profile.birth_date, profile.birth_time, profile.latitude, profile.longitude]):
            return Response(
                {"error": "Please complete your birth details in the profile page."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Convert to UTC (assumes IST stored)
        dt = datetime.datetime.combine(profile.birth_date, profile.birth_time)
        dt_utc = dt - datetime.timedelta(hours=5, minutes=30)
        jd = swe.julday(
            dt_utc.year, dt_utc.month, dt_utc.day,
            dt_utc.hour + dt_utc.minute / 60.0
        )

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

        # Main chart (if you use it elsewhere)
        _ = get_birth_chart_data(positions, nakshatra, asc_deg)

        # Navamsa chart
        navamsa = [
            {"name": planet, "navamsa_rasi": nav_rasi, "rasi_lord": get_rasi_lord(nav_rasi)}
            for planet, nav_rasi in calculate_navamsa_chart(positions).items()
        ]

        # Bhava chart
        bhava_chart = {str(i): [] for i in range(1, 13)}
        for planet, house in get_house_placements(positions, asc_deg).items():
            bhava_chart[str(house)].append(planet)

        # Planets payload: include both raw number and display string
        planets = [
            {
                "name": "Ascendant",
                "degree": asc_deg,
                "degree_str": format_deg(asc_deg),
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
                "degree": deg,
                "degree_str": format_deg(deg),
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
        }, status=status.HTTP_200_OK)



#have to order function call
