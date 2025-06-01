from django.shortcuts import render
from core.astrology_utils import get_planet_positions, get_nakshatra

from core.nlp_utils import detect_intent_and_generate_answer
from core.astrology_utils import get_birth_chart_data

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

                chart_data = get_birth_chart_data(positions, nakshatra)
                answer = detect_intent_and_generate_answer(question, chart_data)

            except Exception as e:
                print("ERROR:", e)
                answer = "Something went wrong with your input."

    return render(request, 'landing.html', {'answer': answer})

