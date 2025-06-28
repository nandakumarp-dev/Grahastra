import swisseph as swe
import datetime

# Set ephemeris path and sidereal mode globally
swe.set_ephe_path('core/ephe/')
swe.set_sid_mode(swe.SIDM_LAHIRI)


def get_planet_positions(date_str, time_str, lat, lon):
    year, month, day = map(int, date_str.split('-'))
    hour, minute = map(int, time_str.split(':'))

    # Convert IST to UTC
    dt = datetime.datetime(year, month, day, hour, minute)
    dt_utc = dt - datetime.timedelta(hours=5, minutes=30)
    ut_hour = dt_utc.hour + dt_utc.minute / 60.0

    jd = swe.julday(dt_utc.year, dt_utc.month, dt_utc.day, ut_hour)

    FLAGS = swe.FLG_SIDEREAL | swe.FLG_SWIEPH

    planets = {
        'Sun': swe.SUN,
        'Moon': swe.MOON,
        'Mars': swe.MARS,
        'Mercury': swe.MERCURY,
        'Jupiter': swe.JUPITER,
        'Venus': swe.VENUS,
        'Saturn': swe.SATURN,
        'Rahu': swe.MEAN_NODE,
    }

    positions = {}
    for name, code in planets.items():
        pos = swe.calc_ut(jd, code, FLAGS)[0][0]
        positions[name] = round(pos % 360, 2)

    positions['Ketu'] = round((positions['Rahu'] + 180) % 360, 2)
    return positions


def get_nakshatra(moon_longitude):
    nakshatras = [
        'Ashwathi', 'Bharani', 'Karthika', 'Rohini', 'Makayiram', 'Thiruvathira', 'Punartham',
        'Pooyam', 'Ayilyam', 'Makam', 'Pooram', 'Uthram',
        'Atham', 'Chithira', 'Chothi', 'Vishakham', 'Anizham', 'Thrikketta',
        'Moolam', 'Pooradam', 'Uthradam', 'Thiruvonam', 'Avittam',
        'Chathayam', 'Pooruruttathi', 'Uthrattathi', 'Revathi'
    ]
    index = int(moon_longitude // (360 / 27))
    print("🌕 Moon Sidereal Degree:", moon_longitude)
    print("📍 Nakshatra Index:", index, "→", nakshatras[index])
    return nakshatras[index]


def get_sign_name(degree):
    rashis = [
        "Medam", "Edavam", "Midhunam", "Karkidakam", "Chingam", "Kanni",
        "Thulam", "Vrischikam", "Dhanu", "Makaram", "Kumbham", "Meenam"
    ]
    return rashis[int(degree // 30)]


def get_house_placements(positions, asc_deg):
    """
    Assigns each planet to one of the 12 houses based on its degree relative to the Ascendant degree.
    """
    house_data = {}
    for planet, deg in positions.items():
        diff = (deg - asc_deg) % 360  # Ensure it's in the 0–360 range
        house = int(diff // 30) + 1  # Each house spans 30 degrees
        house_data[planet] = house
    return house_data


def calculate_lagna(jd, lat, lon):
    try:
        # Get ayanamsa
        ayanamsa = swe.get_ayanamsa(jd)

        # Tropical Ascendant from houses
        asc_tropical = swe.houses(jd, lat, lon)[0][0]

        # Convert to sidereal
        asc_sidereal = (asc_tropical - ayanamsa) % 360

        rashi_index = int(asc_sidereal // 30)
        rashis = [
            "Medam", "Edavam", "Midhunam", "Karkidakam",
            "Chingam", "Kanni", "Thulam", "Vrischikam",
            "Dhanu", "Makaram", "Kumbham", "Meenam"
        ]
        return asc_sidereal, rashis[rashi_index]

    except Exception as e:
        print("Error calculating Lagna:", e)
        return 0.0, "Unknown"


def get_birth_chart_data(positions, nakshatra, lagna=None):
    house_placements = get_house_placements(positions, lagna) if lagna else {}
    yogas = detect_yogas({**positions, "Houses": house_placements, "Lagna": lagna})
    signs = {planet: get_sign_name(deg) for planet, deg in positions.items()}

    return {
        "Sun": positions["Sun"],
        "Moon": positions["Moon"],
        "Mars": positions["Mars"],
        "Mercury": positions["Mercury"],
        "Jupiter": positions["Jupiter"],
        "Venus": positions["Venus"],
        "Saturn": positions["Saturn"],
        "Rahu": positions["Rahu"],
        "Ketu": positions["Ketu"],
        "Nakshatra": nakshatra,
        "Lagna": lagna,
        "Houses": house_placements,
        "Signs": signs,
        "Yogas": yogas
    }


def detect_yogas(chart_data):
    yogas = []
    houses = chart_data.get("Houses", {})
    signs = chart_data.get("Signs", {})

    # Define lords for checking ownership-based yogas
    rasi_lords = {
        "Medam": "Mars", "Edavam": "Venus", "Midhunam": "Mercury", "Karkidakam": "Moon",
        "Chingam": "Sun", "Kanni": "Mercury", "Thulam": "Venus", "Vrischikam": "Mars",
        "Dhanu": "Jupiter", "Makaram": "Saturn", "Kumbham": "Saturn", "Meenam": "Jupiter"
    }

    # 1. Gajakesari Yoga – Moon and Jupiter in Kendra (1,4,7,10 from Lagna)
    if houses.get("Moon") in [1, 4, 7, 10] and houses.get("Jupiter") in [1, 4, 7, 10]:
        yogas.append("🌕 Gajakesari Yoga — Moon and Jupiter in Kendra from Lagna.")

    # 2. Budhaditya Yoga – Sun and Mercury in same sign and house
    if signs.get("Sun") == signs.get("Mercury") and houses.get("Sun") == houses.get("Mercury"):
        yogas.append("☀️ Budhaditya Yoga — Sun and Mercury conjunct. Boosts intellect.")

    # 3. Chandra-Mangala Yoga – Moon and Mars in same house
    if houses.get("Moon") == houses.get("Mars"):
        yogas.append("🔥 Chandra-Mangala Yoga — Moon and Mars in same house.")

    # 4. Dhana Yoga – Jupiter, Venus, or Mercury in 2nd or 11th
    for planet in ["Jupiter", "Venus", "Mercury"]:
        if houses.get(planet) in [2, 11]:
            yogas.append(f"💰 Dhana Yoga — {planet} in 2nd or 11th house.")
            break

    # 5. Vipareeta Raja Yoga – Lords of 6/8/12 in another dusthana
    dusthanas = [6, 8, 12]
    for house in dusthanas:
        for planet, house_num in houses.items():
            if house_num == house:
                rasi = signs.get(planet)
                lord = rasi_lords.get(rasi)
                if lord and houses.get(lord) in dusthanas:
                    yogas.append("🌀 Vipareeta Raja Yoga — Lords of dusthanas in dusthanas.")
                    break

    # 6. Kemadruma Yoga – No planets in 2nd and 12th from Moon
    moon_house = houses.get("Moon")
    if moon_house:
        second_from_moon = (moon_house % 12) + 1
        twelfth_from_moon = 12 if moon_house == 1 else moon_house - 1
        occupied = set(houses.values())
        if second_from_moon not in occupied and twelfth_from_moon not in occupied:
            yogas.append("🌑 Kemadruma Yoga — No planets in 2nd and 12th from Moon.")

    # 7. Neecha Bhanga Raja Yoga — Debilitated planet (Saturn in Medam) gets cancellation
    if signs.get("Saturn") == "Medam":
        if houses.get("Saturn") == houses.get("Venus"):
            yogas.append("🧱 Neecha Bhanga Raja Yoga — Debilitation canceled.")

    return yogas


def get_rasi_lord(rasi):
    lords = {
        "Medam": "Mars",
        "Edavam": "Venus",
        "Midhunam": "Mercury",
        "Karkidakam": "Moon",
        "Chingam": "Sun",
        "Kanni": "Mercury",
        "Thulam": "Venus",
        "Vrischikam": "Mars",
        "Dhanu": "Jupiter",
        "Makaram": "Saturn",
        "Kumbham": "Saturn",
        "Meenam": "Jupiter"
    }
    return lords.get(rasi, "Unknown")

def get_nakshatra_lord(nakshatra):
    lords = {
        'Ashwathi': 'Ketu', 'Bharani': 'Venus', 'Karthika': 'Sun', 'Rohini': 'Moon', 'Makayiram': 'Mars',
        'Thiruvathira': 'Rahu', 'Punartham': 'Jupiter', 'Pooyam': 'Saturn', 'Ayilyam': 'Mercury',
        'Makam': 'Ketu', 'Pooram': 'Venus', 'Uthram': 'Sun', 'Atham': 'Moon', 'Chithira': 'Mars',
        'Chothi': 'Rahu', 'Vishakham': 'Jupiter', 'Anizham': 'Saturn', 'Thrikketta': 'Mercury',
        'Moolam': 'Ketu', 'Pooradam': 'Venus', 'Uthradam': 'Sun', 'Thiruvonam': 'Moon',
        'Avittam': 'Mars', 'Chathayam': 'Rahu', 'Pooruruttathi': 'Jupiter', 'Uthrattathi': 'Saturn', 'Revathi': 'Mercury'
    }
    return lords.get(nakshatra, "Unknown")

def format_deg(deg):
    d = int(deg)
    m = int((deg - d) * 60)
    return f"{d}° {m}′"