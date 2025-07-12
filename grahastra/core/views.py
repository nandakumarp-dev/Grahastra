from django.shortcuts import render
from django.views import View
from grahastra.utility import get_coordinates_from_place
from core.astrology_utils import (
    get_planet_positions, get_nakshatra, calculate_lagna,
    get_birth_chart_data, get_rasi_lord, get_nakshatra_lord,
    format_deg, get_sign_name)



class Landing_Home(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'landing_home.html')
