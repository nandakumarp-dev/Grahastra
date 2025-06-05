from django.shortcuts import render
from core.astrology_utils import get_planet_positions, get_nakshatra

from core.nlp_utils import detect_intent_and_generate_answer
from core.astrology_utils import get_birth_chart_data

from core.astrology_utils import calculate_lagna

import swisseph as swe

from django.views import View

def landing_page(request):
    answer = None

    if request.method == 'POST':
        dob = request.POST.get('dob')
        tob = request.POST.get('tob')
        lat = request.POST.get('latitude')
        lon = request.POST.get('longitude')
        question = request.POST.get('question')

        print("DOB:", dob, "TOB:", tob, "LAT:", lat, "LON:", lon, "Q:", question)

        if not (dob and tob and lat and lon and question):
            answer = "Please fill all the fields."
        else:
            try:
                lat = float(lat.strip().replace('°', ''))
                lon = float(lon.strip().replace('°', ''))

                positions = get_planet_positions(dob, tob, lat, lon)
                moon_deg = positions['Moon']
                nakshatra = get_nakshatra(moon_deg)

                # Extract date and time parts from dob and tob
                year, month, day = map(int, dob.split('-'))
                hour, minute = map(int, tob.split(':'))
                ut_time = hour + minute / 60.0
                jd = swe.julday(year, month, day, ut_time)

                
                lagna = calculate_lagna(jd, lat, lon)
                chart_data = get_birth_chart_data(positions, nakshatra, lagna)
                answer = detect_intent_and_generate_answer(question, chart_data)

            except Exception as e:
                print("ERROR:", e)
                answer = "Something went wrong with your input."

    return render(request, 'landing.html', {'answer': answer})


class Landing_Home(View):

    def get(self,request,*args,**kwargs):

        return render(request,'landing_home.html')
    
    

