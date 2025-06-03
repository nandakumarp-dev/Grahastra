import swisseph as swe
import datetime

# Set ephemeris data path (change this to your actual ephemeris folder)
swe.set_ephe_path('core/ephe/')


def get_planet_positions(date_str, time_str, lat, lon):
    year, month, day = map(int, date_str.split('-'))
    hour, minute = map(int, time_str.split(':'))
    ut_time = hour + minute / 60.0

    jd = swe.julday(year, month, day, ut_time)

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
        pos = swe.calc_ut(jd, code)[0][0]
        positions[name] = round(pos % 360, 2)

    ketu_pos = (positions['Rahu'] + 180) % 360
    positions['Ketu'] = round(ketu_pos, 2)

    return positions


def get_nakshatra(moon_longitude):
    nakshatras = [
        'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra', 'Punarvasu',
        'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
        'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
        'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta',
        'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
    ]
    index = int(moon_longitude // (360 / 27))
    return nakshatras[index]


def get_sign_name(degree):
    rashis = [
        "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
        "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ]
    return rashis[int(degree // 30)]


def get_house_placements(positions, lagna_sign):
    rashis = [
        "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
        "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ]

    lagna_index = rashis.index(lagna_sign)
    lagna_start_deg = lagna_index * 30

    house_data = {}
    for planet, deg in positions.items():
        diff = (deg - lagna_start_deg) % 360
        house = int(diff // 30) + 1
        house_data[planet] = house

    return house_data


def calculate_lagna(jd, lat, lon):
    ascendant_longitude = swe.houses(jd, lat, lon)[0][0]
    rashi_index = int(ascendant_longitude // 30)
    rashis = [
        "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
        "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ]
    return rashis[rashi_index]


def get_birth_chart_data(positions, nakshatra, lagna=None):
    house_placements = get_house_placements(positions, lagna) if lagna else {}

    # Merge chart data to pass full context into detect_yogas
    temp_chart = {
        **positions,
        "Houses": house_placements,
        "Lagna": lagna
    }

    yogas = detect_yogas(temp_chart)

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
    lagna = chart_data.get("Lagna", "")
    positions = {k: v for k, v in chart_data.items() if isinstance(v, (int, float))}

    # Gajakesari Yoga
    if houses.get("Moon") in [1, 4, 7, 10] and houses.get("Jupiter") in [1, 4, 7, 10]:
        yogas.append("🌕 Gajakesari Yoga — strong intellect, reputation, and growth.")

    # Budhaditya Yoga
    if houses.get("Sun") == houses.get("Mercury"):
        yogas.append("☀️ Budhaditya Yoga — intelligence, communication skills, and leadership.")

    # Raja Yoga
    kendra = [1, 4, 7, 10]
    if houses.get("Jupiter") in kendra and houses.get("Moon") in kendra:
        yogas.append("👑 Raja Yoga — success, authority, and leadership potential.")

    # Chandra-Mangala Yoga
    if houses.get("Moon") == houses.get("Mars"):
        yogas.append("🔥 Chandra-Mangala Yoga — emotional power + drive, good for business and action.")

    # Dhana Yoga
    wealth_houses = [2, 11]
    for planet in ["Jupiter", "Venus", "Mercury"]:
        if houses.get(planet) in wealth_houses:
            yogas.append("💰 Dhana Yoga — potential for wealth through favorable planetary alignment.")
            break

    # Vipareeta Raja Yoga
    dusthanas = [6, 8, 12]
    count = sum(1 for p in ["Saturn", "Mars", "Ketu"] if houses.get(p) in dusthanas)
    if count >= 2:
        yogas.append("🌀 Vipareeta Raja Yoga — rise through adversity, success after struggle.")

    # Kemadruma Yoga
    moon_house = houses.get("Moon")
    occupied_houses = set(houses.values())
    next_house = (moon_house % 12) + 1
    prev_house = 12 if moon_house == 1 else moon_house - 1
    if next_house not in occupied_houses and prev_house not in occupied_houses:
        yogas.append("🌑 Kemadruma Yoga — emotional isolation, inner reflection, needs connection.")

    # Placeholder Neecha Bhanga Yoga
    if positions.get("Saturn", -1) < 30 and houses.get("Saturn") == houses.get("Venus"):
        yogas.append("🧱 Neecha Bhanga Raja Yoga — overcoming weakness, strength through difficulty.")

    return yogas
