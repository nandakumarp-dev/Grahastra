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
    positions = {k: v for k, v in chart_data.items() if isinstance(v, (int, float))}

    # Gajakesari Yoga
    if houses.get("Moon") in [1, 4, 7, 10] and houses.get("Jupiter") in [1, 4, 7, 10]:
        yogas.append("🌕 Gajakesari Yoga — strong intellect, reputation, and growth.")

    # Budhaditya Yoga
    if houses.get("Sun") == houses.get("Mercury"):
        yogas.append("☀️ Budhaditya Yoga — intelligence, communication skills, and leadership.")

    # Raja Yoga
    if houses.get("Jupiter") in [1, 4, 7, 10] and houses.get("Moon") in [1, 4, 7, 10]:
        yogas.append("👑 Raja Yoga — success, authority, and leadership potential.")

    # Chandra-Mangala Yoga
    if houses.get("Moon") == houses.get("Mars"):
        yogas.append("🔥 Chandra-Mangala Yoga — emotional power + drive, good for business and action.")

    # Dhana Yoga
    if any(houses.get(p) in [2, 11] for p in ["Jupiter", "Venus", "Mercury"]):
        yogas.append("💰 Dhana Yoga — potential for wealth through favorable planetary alignment.")

    # Vipareeta Raja Yoga
    if sum(1 for p in ["Saturn", "Mars", "Ketu"] if houses.get(p) in [6, 8, 12]) >= 2:
        yogas.append("🌀 Vipareeta Raja Yoga — rise through adversity, success after struggle.")

    # Kemadruma Yoga
    moon_house = houses.get("Moon")
    occupied = set(houses.values())
    if moon_house and ((moon_house % 12) + 1 not in occupied and (moon_house - 1 or 12) not in occupied):
        yogas.append("🌑 Kemadruma Yoga — emotional isolation, inner reflection, needs connection.")

    # Neecha Bhanga Raja Yoga (example condition)
    if positions.get("Saturn", -1) < 30 and houses.get("Saturn") == houses.get("Venus"):
        yogas.append("🧱 Neecha Bhanga Raja Yoga — overcoming weakness, strength through difficulty.")

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