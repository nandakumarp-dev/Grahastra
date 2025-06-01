import swisseph as swe
import datetime

# Set ephemeris data path (change this to your actual ephemeris folder)
swe.set_ephe_path('core/ephe/')

def get_planet_positions(date_str, time_str, lat, lon):
    # Convert input to Julian date
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

    # Calculate Ketu as opposite of Rahu
    ketu_pos = (positions['Rahu'] + 180) % 360
    positions['Ketu'] = round(ketu_pos, 2)

    return positions

