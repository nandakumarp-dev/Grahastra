import swisseph as swe
import datetime

# -------------------- SETUP --------------------

# Set path to ephemeris data files and sidereal mode (Lahiri Ayanamsa)
swe.set_ephe_path('core/ephe/')
swe.set_sid_mode(swe.SIDM_LAHIRI)


# -------------------- PLANETARY POSITIONS --------------------

def get_planet_positions(date_str, time_str, lat, lon):
    """
    Calculate planetary positions (degrees) in the sidereal zodiac
    for given date, time, and location.

    Args:
        date_str (str): Date in 'YYYY-MM-DD'
        time_str (str): Time in 'HH:MM'
        lat (float): Latitude
        lon (float): Longitude

    Returns:
        dict: Planetary positions (Sun, Moon, etc.) in degrees
    """
    # Parse date and time
    year, month, day = map(int, date_str.split('-'))
    hour, minute = map(int, time_str.split(':'))

    # Convert IST to UTC for Swiss Ephemeris
    dt = datetime.datetime(year, month, day, hour, minute)
    dt_utc = dt - datetime.timedelta(hours=5, minutes=30)
    ut_hour = dt_utc.hour + dt_utc.minute / 60.0

    # Julian Day calculation
    jd = swe.julday(dt_utc.year, dt_utc.month, dt_utc.day, ut_hour)

    FLAGS = swe.FLG_SIDEREAL | swe.FLG_SWIEPH

    # Define planets to calculate
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

    # Store planetary longitudes
    positions = {}
    for name, code in planets.items():
        pos = swe.calc_ut(jd, code, FLAGS)[0][0]
        positions[name] = round(pos % 360, 2)

    # Ketu is always opposite Rahu (180° apart)
    positions['Ketu'] = round((positions['Rahu'] + 180) % 360, 2)

    return positions


# -------------------- NAKSHATRA --------------------

def get_nakshatra(moon_longitude):
    """
    Get Nakshatra name from Moon's sidereal longitude.

    Args:
        moon_longitude (float): Moon’s position in degrees

    Returns:
        str: Nakshatra name
    """
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


# -------------------- RASHI / SIGN --------------------

def get_sign_name(degree):
    """
    Get Rashi (zodiac sign) name from a given degree.

    Args:
        degree (float): Sidereal longitude

    Returns:
        str: Sign name (Rashi)
    """
    rashis = [
        "Medam", "Edavam", "Midhunam", "Karkidakam", "Chingam", "Kanni",
        "Thulam", "Vrischikam", "Dhanu", "Makaram", "Kumbham", "Meenam"
    ]
    return rashis[int(degree // 30)]


# -------------------- HOUSES --------------------

def get_house_placements(positions, asc_deg):
    """
    Assign each planet to one of the 12 houses relative to Lagna (Ascendant).

    Args:
        positions (dict): Planetary positions in degrees
        asc_deg (float): Ascendant degree (sidereal)

    Returns:
        dict: Planet → House number
    """
    house_data = {}
    for planet, deg in positions.items():
        diff = (deg - asc_deg) % 360
        house = int(diff // 30) + 1
        house_data[planet] = house
    return house_data


def calculate_lagna(jd, lat, lon):
    """
    Calculate sidereal ascendant (Lagna) and its Rashi.

    Args:
        jd (float): Julian Day
        lat (float): Latitude
        lon (float): Longitude

    Returns:
        tuple: (ascendant in degrees, ascendant rashi name)
    """
    try:
        # Ayanamsa correction
        ayanamsa = swe.get_ayanamsa(jd)

        # Get tropical Ascendant
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


# -------------------- CHART INTERPRETATION --------------------

def get_birth_chart_data(positions, nakshatra, lagna=None):
    """
    Bundle all chart data including houses, signs, yogas.

    Args:
        positions (dict): Planetary positions
        nakshatra (str): Moon Nakshatra
        lagna (float): Ascendant degree

    Returns:
        dict: Complete birth chart data
    """
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


# -------------------- YOGA DETECTION --------------------

def detect_yogas(chart_data):
    """
    Detect special yogas (planetary combinations) in the chart.

    Args:
        chart_data (dict): Includes planet signs, houses, etc.

    Returns:
        list: List of detected yogas
    """
    yogas = []
    houses = chart_data.get("Houses", {})
    signs = chart_data.get("Signs", {})

    # Rashi lords map
    rasi_lords = {
        "Medam": "Mars", "Edavam": "Venus", "Midhunam": "Mercury", "Karkidakam": "Moon",
        "Chingam": "Sun", "Kanni": "Mercury", "Thulam": "Venus", "Vrischikam": "Mars",
        "Dhanu": "Jupiter", "Makaram": "Saturn", "Kumbham": "Saturn", "Meenam": "Jupiter"
    }

    # 1. Gajakesari Yoga
    if houses.get("Moon") in [1, 4, 7, 10] and houses.get("Jupiter") in [1, 4, 7, 10]:
        yogas.append("🌕 Gajakesari Yoga — Moon and Jupiter in Kendra from Lagna.")

    # 2. Budhaditya Yoga
    if signs.get("Sun") == signs.get("Mercury") and houses.get("Sun") == houses.get("Mercury"):
        yogas.append("☀️ Budhaditya Yoga — Sun and Mercury conjunct. Boosts intellect.")

    # 3. Chandra-Mangala Yoga
    if houses.get("Moon") == houses.get("Mars"):
        yogas.append("🔥 Chandra-Mangala Yoga — Moon and Mars in same house.")

    # 4. Dhana Yoga
    for planet in ["Jupiter", "Venus", "Mercury"]:
        if houses.get(planet) in [2, 11]:
            yogas.append(f"💰 Dhana Yoga — {planet} in 2nd or 11th house.")
            break

    # 5. Vipareeta Raja Yoga
    dusthanas = [6, 8, 12]
    for house in dusthanas:
        for planet, house_num in houses.items():
            if house_num == house:
                rasi = signs.get(planet)
                lord = rasi_lords.get(rasi)
                if lord and houses.get(lord) in dusthanas:
                    yogas.append("🌀 Vipareeta Raja Yoga — Lords of dusthanas in dusthanas.")
                    break

    # 6. Kemadruma Yoga
    moon_house = houses.get("Moon")
    if moon_house:
        second = (moon_house % 12) + 1
        twelfth = 12 if moon_house == 1 else moon_house - 1
        occupied = set(houses.values())
        if second not in occupied and twelfth not in occupied:
            yogas.append("🌑 Kemadruma Yoga — No planets in 2nd and 12th from Moon.")

    # 7. Neecha Bhanga Raja Yoga
    if signs.get("Saturn") == "Medam" and houses.get("Saturn") == houses.get("Venus"):
        yogas.append("🧱 Neecha Bhanga Raja Yoga — Debilitation canceled.")

    return yogas


# -------------------- UTILITIES --------------------

def get_rasi_lord(rasi):
    """Get planetary lord of a given Rashi (sign)."""
    lords = {
        "Medam": "Mars", "Edavam": "Venus", "Midhunam": "Mercury", "Karkidakam": "Moon",
        "Chingam": "Sun", "Kanni": "Mercury", "Thulam": "Venus", "Vrischikam": "Mars",
        "Dhanu": "Jupiter", "Makaram": "Saturn", "Kumbham": "Saturn", "Meenam": "Jupiter"
    }
    return lords.get(rasi, "Unknown")


def get_nakshatra_lord(nakshatra):
    """Get planetary lord of a given Nakshatra."""
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
    """Format degree as degrees and minutes string."""
    d = int(deg)
    m = int((deg - d) * 60)
    return f"{d}° {m}′"


def calculate_navamsa_chart(planet_positions):
    """
    Calculate Navamsa (D9) sign placements for each planet from Rasi (D1) positions.

    Args:
        planet_positions (dict): Planetary positions in degrees (0–360)

    Returns:
        dict: Planet → Navamsa Rashi name
    """
    # Define Rasi order
    rashis = [
        "Medam", "Edavam", "Midhunam", "Karkidakam", "Chingam", "Kanni",
        "Thulam", "Vrischikam", "Dhanu", "Makaram", "Kumbham", "Meenam"
    ]

    # For each Rasi, the Navamsa sequence is different depending on whether it’s movable, fixed, or dual
    navamsa_chart = {}

    for planet, degree in planet_positions.items():
        # Step 1: Find Rasi index and degrees within the Rasi
        rasi_index = int(degree // 30)
        rasi_start = rasi_index * 30
        deg_in_rasi = degree - rasi_start

        # Step 2: Find Navamsa index (0 to 8)
        navamsa_index = int(deg_in_rasi // (30 / 9))  # Each Navamsa = 3°20′

        # Step 3: Determine starting Navamsa sign based on Rasi type
        rasi_type = rasi_index % 3
        if rasi_type == 0:
            # Movable signs: start Navamsa from same sign
            start_index = rasi_index
        elif rasi_type == 1:
            # Fixed signs: start Navamsa from 9th sign from Rasi
            start_index = (rasi_index + 8) % 12
        else:
            # Dual signs: start from 5th sign from Rasi
            start_index = (rasi_index + 4) % 12

        # Step 4: Add navamsa_index to starting index to get final Navamsa Rashi
        navamsa_rasi_index = (start_index + navamsa_index) % 12
        navamsa_chart[planet] = rashis[navamsa_rasi_index]

    return navamsa_chart
