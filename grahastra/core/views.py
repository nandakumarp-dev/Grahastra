from django.shortcuts import render
from django.views import View
from datetime import datetime, timedelta
import swisseph as swe
from grahastra.utility import get_coordinates_from_place
from core.astrology_utils import (
    get_planet_positions, get_nakshatra, calculate_lagna,
    get_birth_chart_data, get_rasi_lord, get_nakshatra_lord,
    format_deg, get_sign_name
)

def landing_page(request):
    swe.set_ephe_path('core/ephe/')
    swe.set_sid_mode(swe.SIDM_LAHIRI)

    if request.method == "POST":
        dob = request.POST.get("dob")
        tob = request.POST.get("tob")
        pob = request.POST.get("pob")

        try:
            dt = datetime.strptime(f"{dob} {tob}", "%Y-%m-%d %H:%M")
            dt_utc = dt - timedelta(hours=5, minutes=30)
            ut_hour = dt_utc.hour + dt_utc.minute / 60.0
            jd = swe.julday(dt_utc.year, dt_utc.month, dt_utc.day, ut_hour)

            lat, lon = get_coordinates_from_place(pob)
            if lat is None or lon is None:
                raise ValueError("Invalid place of birth. Coordinates not found.")

            # Step 1: Calculate planets and lagna
            positions = get_planet_positions(dob, tob, lat, lon)
            asc_deg, lagna_sign = calculate_lagna(jd, lat, lon)
            nakshatra = get_nakshatra(positions["Moon"])
            chart = get_birth_chart_data(positions, nakshatra, asc_deg)

            # Step 2: Build detailed planetary table
            chart["Planets"] = []

            # Ascendant
            chart["Planets"].append({
                "name": "Ascendant",
                "degree": format_deg(asc_deg),
                "rasi": lagna_sign,
                "rasi_lord": get_rasi_lord(lagna_sign),
                "nakshatra": get_nakshatra(asc_deg),
                "nakshatra_lord": get_nakshatra_lord(get_nakshatra(asc_deg)),
            })

            # Planets
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

            context = {
                "chart": chart,
                "dob": dob,
                "tob": tob,
                "pob": pob,
            }

            return render(request, "landing.html", context)

        except Exception as e:
            import traceback
            traceback.print_exc()
            return render(request, "landing.html", {"error": f"An error occurred: {e}"})

    return render(request, "landing.html")

class Landing_Home(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'landing_home.html')
