from django.shortcuts import render
from core.astrology_utils import get_planet_positions, get_nakshatra

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

                if "marriage" in question.lower():
                    answer = f"Based on Venus and Moon, marriage could be after age 27."
                else:
                    answer = f"Nakshatra: {nakshatra}. Full answers coming soon."

            except Exception as e:
                print("ERROR:", e)
                answer = "Something went wrong with your input."

    print("DOB:", dob)
    print("TOB:", tob)
    print("Lat:", lat)
    print("Lon:", lon)
    print("Question:", question)

    return render(request, 'landing.html', {'answer': answer})



