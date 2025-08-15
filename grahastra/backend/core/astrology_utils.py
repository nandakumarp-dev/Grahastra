# Refined version of astrology_utils.py

import swisseph as swe
import datetime

# -------------------- SETUP --------------------
swe.set_ephe_path('core/ephe/')
swe.set_sid_mode(swe.SIDM_LAHIRI)

# -------------------- CONSTANTS --------------------
KENDRA_HOUSES = [1, 4, 7, 10]
TRIKONA_HOUSES = [1, 5, 9]
DUSTHANA_HOUSES = [6, 8, 12]
RASI_LORDS = {
    "Medam": "Mars", "Edavam": "Venus", "Midhunam": "Mercury", "Karkidakam": "Moon",
    "Chingam": "Sun", "Kanni": "Mercury", "Thulam": "Venus", "Vrischikam": "Mars",
    "Dhanu": "Jupiter", "Makaram": "Saturn", "Kumbham": "Saturn", "Meenam": "Jupiter"
}
NAKSHATRAS = [
    'Ashwathi', 'Bharani', 'Karthika', 'Rohini', 'Makayiram', 'Thiruvathira', 'Punartham',
    'Pooyam', 'Ayilyam', 'Makam', 'Pooram', 'Uthram', 'Atham', 'Chithira', 'Chothi', 'Vishakham',
    'Anizham', 'Thrikketta', 'Moolam', 'Pooradam', 'Uthradam', 'Thiruvonam', 'Avittam', 'Chathayam',
    'Pooruruttathi', 'Uthrattathi', 'Revathi'
]
RASHIS = [
    "Medam", "Edavam", "Midhunam", "Karkidakam", "Chingam", "Kanni",
    "Thulam", "Vrischikam", "Dhanu", "Makaram", "Kumbham", "Meenam"
]

# -------------------- PLANETARY POSITIONS --------------------
def get_planet_positions(date_str, time_str, lat, lon):
    year, month, day = map(int, date_str.split('-'))
    hour, minute = map(int, time_str.split(':'))
    dt = datetime.datetime(year, month, day, hour, minute)
    dt_utc = dt - datetime.timedelta(hours=5, minutes=30)
    ut_hour = dt_utc.hour + dt_utc.minute / 60.0
    jd = swe.julday(dt_utc.year, dt_utc.month, dt_utc.day, ut_hour)

    FLAGS = swe.FLG_SIDEREAL | swe.FLG_SWIEPH
    planet_codes = {
        'Sun': swe.SUN, 'Moon': swe.MOON, 'Mars': swe.MARS, 'Mercury': swe.MERCURY,
        'Jupiter': swe.JUPITER, 'Venus': swe.VENUS, 'Saturn': swe.SATURN, 'Rahu': swe.MEAN_NODE,
    }

    positions = {
        name: round(swe.calc_ut(jd, code, FLAGS)[0][0] % 360, 2)
        for name, code in planet_codes.items()
    }
    positions['Ketu'] = round((positions['Rahu'] + 180) % 360, 2)
    return positions

# -------------------- BASIC CALCULATIONS --------------------
def get_nakshatra(longitude):
    return NAKSHATRAS[int(longitude // (360 / 27))]

def get_sign_name(degree):
    return RASHIS[int(degree // 30)]

def get_rasi_lord(sign):
    return RASI_LORDS.get(sign, "Unknown")

def get_nakshatra_lord(nak):
    # Placeholder logic, define as needed
    return "Nakshatra Lord"

def format_deg(deg):
    sign = int(deg // 30)
    minutes = (deg % 30) * 2
    return f"{int(deg)}° ({RASHIS[sign]})"

# -------------------- CHART STRUCTURE --------------------
def calculate_lagna(jd, lat, lon):
    try:
        ayanamsa = swe.get_ayanamsa(jd)
        asc_tropical = swe.houses(jd, lat, lon)[0][0]
        asc_sidereal = (asc_tropical - ayanamsa) % 360
        return asc_sidereal, get_sign_name(asc_sidereal)
    except:
        return 0.0, "Unknown"

def get_house_placements(positions, asc_deg):
    return {
        planet: int(((deg - asc_deg) % 360) // 30) + 1
        for planet, deg in positions.items()
    }

def calculate_navamsa_chart(positions):
    return {
        planet: get_sign_name((deg % 30) * 12)
        for planet, deg in positions.items()
    }

def get_birth_chart_data(positions, nakshatra, lagna=None):
    signs = {planet: get_sign_name(deg) for planet, deg in positions.items()}
    houses = get_house_placements(positions, lagna) if lagna else {}
    chart = {
        **positions,
        "Nakshatra": nakshatra,
        "Lagna": lagna,
        "Signs": signs,
        "Houses": houses,
    }
    chart["Yogas"] = detect_yogas(chart)
    return chart

# -------------------- YOGA UTILITIES --------------------
def is_conjunct(deg1, deg2, max_diff=10):
    return abs((deg1 - deg2 + 180) % 360 - 180) <= max_diff

def get_planet_house(chart, planet): return chart.get("Houses", {}).get(planet)
def get_planet_sign(chart, planet): return chart.get("Signs", {}).get(planet)
def get_planet_degree(chart, planet): return chart.get(planet)
def get_lagna(chart): return chart.get("Lagna", 0)

# -------------------- YOGA DETECTORS --------------------
def detect_gajakesari(chart):
    if get_planet_house(chart, "Moon") in KENDRA_HOUSES and get_planet_house(chart, "Jupiter") in KENDRA_HOUSES:
        return "🌕 Gajakesari Yoga — Moon and Jupiter in Kendra."

def detect_budhaditya(chart):
    if get_planet_sign(chart, "Sun") == get_planet_sign(chart, "Mercury") and is_conjunct(get_planet_degree(chart, "Sun"), get_planet_degree(chart, "Mercury")):
        return "☀️ Budhaditya Yoga — Sun and Mercury conjunct."

def detect_chandra_mangala(chart):
    if get_planet_sign(chart, "Moon") == get_planet_sign(chart, "Mars") and is_conjunct(get_planet_degree(chart, "Moon"), get_planet_degree(chart, "Mars")):
        return "🔥 Chandra-Mangala Yoga — Moon and Mars conjunct."

def detect_dhana_yogas(chart):
    return [f"💰 Dhana Yoga — {planet} in house {house}."
            for planet in ["Jupiter", "Venus", "Mercury"]
            if (house := get_planet_house(chart, planet)) in [2, 11]]

def detect_vipareeta_raja_yoga(chart):
    for planet, house in chart.get("Houses", {}).items():
        if house in DUSTHANA_HOUSES:
            lord = RASI_LORDS.get(chart["Signs"].get(planet))
            if lord and get_planet_house(chart, lord) in DUSTHANA_HOUSES:
                return f"🌀 Vipareeta Raja Yoga — {planet} and {lord} in dusthanas."

def detect_kemadruma(chart):
    moon_house = get_planet_house(chart, "Moon")
    if not moon_house:
        return None
    second = (moon_house % 12) + 1
    twelfth = 12 if moon_house == 1 else moon_house - 1
    occupied = set(chart["Houses"].values())
    if second not in occupied and twelfth not in occupied:
        return "🌑 Kemadruma Yoga — No planets in 2nd and 12th from Moon."

def detect_neecha_bhanga(chart):
    if get_planet_sign(chart, "Saturn") == "Medam" and get_planet_house(chart, "Saturn") == get_planet_house(chart, "Venus"):
        return "🧱 Neecha Bhanga Raja Yoga — Saturn debilitation cancelled."

# -------------------- MAIN YOGA DETECTION --------------------
def detect_yogas(chart):
    detectors = [
        detect_gajakesari, detect_budhaditya, detect_chandra_mangala,
        detect_dhana_yogas, detect_vipareeta_raja_yoga,
        detect_kemadruma, detect_neecha_bhanga,
    ]
    yogas = []
    for detect in detectors:
        result = detect(chart)
        if result:
            yogas.extend(result if isinstance(result, list) else [result])
    return yogas