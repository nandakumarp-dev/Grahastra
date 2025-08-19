# src grahastra/backend/core/astrology_utils.py
# -*- coding: utf-8 -*-
"""
Professional-grade astrology utilities built on Swiss Ephemeris (sidereal / Lahiri).

Notes:
- This module keeps your existing public API and extends it with:
  Planetary strengths, Divisional charts (D1/D3/D4/D9/D10), Nakshatra details,
  Vimshottari Dasha, Ashtakavarga (lightweight approximation), expanded Yogas,
  Doshas, Aspects (Graha & Rashi), Transits (Saturn/Jupiter), and an orchestrator
  `generate_professional_birth_chart` to produce a full JSON-like dictionary.

Caveats:
- Some classical computations (e.g., Shadbala, full Ashtakavarga) are simplified
  but structured to allow future replacement with rigorous calculations.
- All angular math is done in 0–360° with helper utilities provided.

Dependencies: `pyswisseph` as `swisseph` (import as `swe`).
"""

import swisseph as swe
import datetime
from dataclasses import dataclass
from typing import Dict, List, Tuple, Any

# -------------------- SETUP --------------------
swe.set_ephe_path('core/ephe/')
swe.set_sid_mode(swe.SIDM_LAHIRI)

# -------------------- CONSTANTS --------------------
KENDRA_HOUSES = [1, 4, 7, 10]
TRIKONA_HOUSES = [1, 5, 9]
DUSTHANA_HOUSES = [6, 8, 12]
BENEFICS = {"Jupiter", "Venus", "Mercury"}  # Moon waxing treated benefic contextually
MALEFICS = {"Saturn", "Mars", "Rahu", "Ketu"}

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

# Nakshatra lords in Vimshottari order starting from Ashwini (Ketu)
NAK_LORD_SEQ = [
    'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'
]

# Dasha order and years (Vimshottari)
DASHA_ORDER = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury']
DASHA_YEARS = {
    'Ketu': 7, 'Venus': 20, 'Sun': 6, 'Moon': 10,
    'Mars': 7, 'Rahu': 18, 'Jupiter': 16, 'Saturn': 19, 'Mercury': 17
}

PLANET_CODES = {
    'Sun': swe.SUN, 'Moon': swe.MOON, 'Mars': swe.MARS, 'Mercury': swe.MERCURY,
    'Jupiter': swe.JUPITER, 'Venus': swe.VENUS, 'Saturn': swe.SATURN, 'Rahu': swe.MEAN_NODE
}

EXALTATION_SIGNS = {
    'Sun': 'Medam',      # Aries
    'Moon': 'Vrischikam',# Taurus? (Traditionally Moon exalted in Taurus; Malayalam mapping: Edavam)
    'Mars': 'Makaram',   # Capricorn? (Traditionally Mars exalted in Capricorn; Malayalam: Makaram)
    'Mercury': 'Kanni',  # Virgo
    'Jupiter': 'Karkidakam', # Cancer
    'Venus': 'Meenam',   # Pisces
    'Saturn': 'Thulam'   # Libra
}
# Correction for Malayalam sign names:
EXALTATION_SIGNS.update({
    'Moon': 'Edavam',     # Taurus
})

DEBILITATION_SIGNS = {
    'Sun': 'Thulam',      # Libra
    'Moon': 'Vrischikam', # Scorpio
    'Mars': 'Karkidakam', # Cancer
    'Mercury': 'Meenam',  # Pisces
    'Jupiter': 'Makaram', # Capricorn
    'Venus': 'Kanni',     # Virgo
    'Saturn': 'Chingam'   # Aries
}

COMBUSTION_ORBS = {
    # Simplified classical orbs (degrees)
    'Moon': 12.0,
    'Mars': 7.0,
    'Mercury': 14.0,  # 12–14 direct, simplified
    'Jupiter': 11.0,
    'Venus': 10.0,
    'Saturn': 15.0
}

# -------------------- UTILS --------------------

def dms_normalize(angle: float) -> float:
    return angle % 360.0

def angle_diff(a: float, b: float) -> float:
    """Smallest angular difference between a and b in degrees."""
    return abs((a - b + 180.0) % 360.0 - 180.0)

# -------------------- PLANETARY POSITIONS --------------------
def get_planet_positions(date_str: str, time_str: str, lat: float, lon: float) -> Dict[str, float]:
    year, month, day = map(int, date_str.split('-'))
    hour, minute = map(int, time_str.split(':'))
    dt = datetime.datetime(year, month, day, hour, minute)
    # Convert given IST to UTC (fixed IST offset)
    dt_utc = dt - datetime.timedelta(hours=5, minutes=30)
    ut_hour = dt_utc.hour + dt_utc.minute / 60.0
    jd = swe.julday(dt_utc.year, dt_utc.month, dt_utc.day, ut_hour)

    FLAGS = swe.FLG_SIDEREAL | swe.FLG_SWIEPH
    positions = {}
    for name, code in PLANET_CODES.items():
        xx, _fl = swe.calc_ut(jd, code, FLAGS)
        positions[name] = round(dms_normalize(xx[0]), 2)
    # Ketu opposite Rahu
    positions['Ketu'] = round(dms_normalize(positions['Rahu'] + 180.0), 2)
    return positions

# Also return speeds (for retrograde)
def get_planet_positions_with_speed(jd: float) -> Dict[str, Tuple[float, float]]:
    FLAGS = swe.FLG_SIDEREAL | swe.FLG_SWIEPH
    pos = {}
    for name, code in PLANET_CODES.items():
        xx, _fl = swe.calc_ut(jd, code, FLAGS)
        lon = dms_normalize(xx[0])
        spd = xx[3]
        pos[name] = (lon, spd)
    pos['Ketu'] = (dms_normalize(pos['Rahu'][0] + 180.0), -pos['Rahu'][1])
    return pos

# -------------------- BASIC CALCULATIONS --------------------

def get_nakshatra(longitude: float) -> str:
    return NAKSHATRAS[int(longitude // (360 / 27))]

def get_nakshatra_index(longitude: float) -> int:
    return int(longitude // (360 / 27))

NAK_SEG = 360.0 / 27.0
PADA_SEG = NAK_SEG / 4.0  # 3°20'

def get_nakshatra_pada(longitude: float) -> int:
    nak_start = get_nakshatra_index(longitude) * NAK_SEG
    rem = (longitude - nak_start)
    return int(rem // PADA_SEG) + 1


def get_sign_name(degree: float) -> str:
    return RASHIS[int(degree // 30)]


def get_rasi_lord(sign: str) -> str:
    return RASI_LORDS.get(sign, "Unknown")


def get_nakshatra_lord(nak: str) -> str:
    idx = NAKSHATRAS.index(nak)
    return NAK_LORD_SEQ[idx % 9]


def format_deg(deg: float) -> str:
    sign_index = int(deg // 30)
    deg_in_sign = deg % 30
    mins = (deg_in_sign - int(deg_in_sign)) * 60
    return f"{int(deg_in_sign)}°{int(mins)}' ({RASHIS[sign_index]})"

# -------------------- CHART STRUCTURE --------------------

def calculate_lagna(jd: float, lat: float, lon: float) -> Tuple[float, str]:
    try:
        ayanamsa = swe.get_ayanamsa(jd)
        asc_tropical = swe.houses(jd, lat, lon)[0][0]
        asc_sidereal = dms_normalize(asc_tropical - ayanamsa)
        return asc_sidereal, get_sign_name(asc_sidereal)
    except Exception:
        return 0.0, "Unknown"


def get_house_placements(positions: Dict[str, float], asc_deg: float) -> Dict[str, int]:
    return {planet: int(((deg - asc_deg) % 360) // 30) + 1 for planet, deg in positions.items()}


def calculate_navamsa_chart(positions: Dict[str, float]) -> Dict[str, str]:
    # D9: Each 3°20' step maps to a Navamsa sign in a sign-specific order.
    navamsa = {}
    for planet, deg in positions.items():
        sign_index = int(deg // 30)
        sign_deg = deg % 30
        pada = int(sign_deg // (30/9))  # 0..8
        # Sequence for movable, fixed, dual signs
        # Movable: sign -> sign, then sequential
        # Fixed: 9th from sign; Dual: 5th from sign
        if sign_index in [0, 3, 6, 9]:  # movable
            start = sign_index
        elif sign_index in [1, 4, 7, 10]:  # fixed
            start = (sign_index + 8) % 12
        else:  # dual
            start = (sign_index + 4) % 12
        nav_sign = (start + pada) % 12
        navamsa[planet] = RASHIS[nav_sign]
    return navamsa


def calculate_drekkana_chart(positions: Dict[str, float]) -> Dict[str, str]:
    # D3: Each 10° -> a Drekkana sign
    d3 = {}
    for p, deg in positions.items():
        sign_index = int(deg // 30)
        offset = int((deg % 30) // 10)
        d3_sign = (sign_index + offset * 4) % 12  # classical Parashara mapping
        d3[p] = RASHIS[d3_sign]
    return d3


def calculate_chaturthamsa_chart(positions: Dict[str, float]) -> Dict[str, str]:
    # D4: 7°30' per part; movable/fixed/dual mapping
    d4 = {}
    for p, deg in positions.items():
        sign_index = int(deg // 30)
        part = int((deg % 30) // 7.5)  # 0..3
        if sign_index in [0, 3, 6, 9]:
            start = sign_index
        elif sign_index in [1, 4, 7, 10]:
            start = (sign_index + 3) % 12
        else:
            start = (sign_index + 6) % 12
        d4[p] = RASHIS[(start + part) % 12]
    return d4


def calculate_dasamsa_chart(positions: Dict[str, float]) -> Dict[str, str]:
    # D10: 3° per part; movable/fixed/dual mapping
    d10 = {}
    for p, deg in positions.items():
        sign_index = int(deg // 30)
        part = int((deg % 30) // 3)  # 0..9
        if sign_index in [0, 3, 6, 9]:
            start = sign_index
        elif sign_index in [1, 4, 7, 10]:
            start = (sign_index + 8) % 12
        else:
            start = (sign_index + 4) % 12
        d10[p] = RASHIS[(start + part) % 12]
    return d10


def get_birth_chart_data(positions: Dict[str, float], nakshatra: str, lagna: float = None) -> Dict[str, Any]:
    signs = {planet: get_sign_name(deg) for planet, deg in positions.items()}
    houses = get_house_placements(positions, lagna) if lagna is not None else {}
    chart = {
        **positions,
        "Nakshatra": nakshatra,
        "Lagna": lagna,
        "Signs": signs,
        "Houses": houses,
    }
    chart["Yogas"] = detect_yogas(chart)
    return chart

# -------------------- PLANETARY STRENGTHS --------------------

def get_exaltation_status(planet: str, degree: float) -> str:
    sign = get_sign_name(degree)
    if planet in EXALTATION_SIGNS and sign == EXALTATION_SIGNS[planet]:
        return "Exalted"
    if planet in DEBILITATION_SIGNS and sign == DEBILITATION_SIGNS[planet]:
        return "Debilitated"
    # Own sign
    if get_rasi_lord(sign) == planet:
        return "Own Sign"
    return "Neutral"


def is_combust(planet: str, planet_deg: float, sun_deg: float) -> bool:
    if planet in ["Sun", "Rahu", "Ketu"]:
        return False
    orb = COMBUSTION_ORBS.get(planet, 8.0)
    return angle_diff(planet_deg, sun_deg) <= orb


def is_retrograde(jd: float, planet: str) -> bool:
    if planet not in PLANET_CODES:
        return False
    FLAGS = swe.FLG_SIDEREAL | swe.FLG_SWIEPH
    xx, _fl = swe.calc_ut(jd, PLANET_CODES[planet], FLAGS)
    return xx[3] < 0.0

# Simplified Shadbala placeholder: 0–1 score per planet
# (real Shadbala involves six balas; here we aggregate simple proxies)

def calculate_shadbala(positions: Dict[str, float]) -> Dict[str, float]:
    scores = {}
    for p, deg in positions.items():
        base = 0.5
        status = get_exaltation_status(p, deg)
        if status == "Exalted":
            base += 0.25
        elif status == "Debilitated":
            base -= 0.2
        # Kendras add strength
        # Lagna unknown here; caller can re-weight later
        scores[p] = max(0.0, min(1.0, base))
    return scores


def get_baladi_avastha(planet: str, degree: float) -> str:
    # Very simplified Baladi Avastha by sign degree quinquants
    d = (degree % 30)
    if d < 6: return "Bala"
    if d < 12: return "Kumara"
    if d < 18: return "Yuva"
    if d < 24: return "Vriddha"
    return "Mrita"

# -------------------- HOUSE LORDS --------------------

def get_house_signs(asc_deg: float) -> Dict[int, str]:
    asc_index = int(asc_deg // 30)
    return {h: RASHIS[(asc_index + h - 1) % 12] for h in range(1, 13)}


def get_house_lords(asc_deg: float) -> Dict[int, str]:
    signs = get_house_signs(asc_deg)
    return {h: get_rasi_lord(signs[h]) for h in range(1, 13)}

# -------------------- ASPECTS --------------------

def get_graha_drishti(planet: str, degree: float) -> List[int]:
    """Return list of house offsets (from planet) it aspects by special drishti.
    We'll use house offsets relative to the planet's house position.
    Mars: 4,7,8 ; Jupiter: 5,7,9 ; Saturn: 3,7,10 ; Others: 7
    """
    if planet == 'Mars':
        return [4, 7, 8]
    if planet == 'Jupiter':
        return [5, 7, 9]
    if planet == 'Saturn':
        return [3, 7, 10]
    return [7]


def calculate_aspects(positions: Dict[str, float], asc_deg: float) -> Dict[str, List[int]]:
    houses = get_house_placements(positions, asc_deg)
    aspects = {}
    for p, h in houses.items():
        offs = get_graha_drishti(p, positions[p])
        aspects[p] = [((h - 1 + o) % 12) + 1 for o in offs]
    return aspects

# Simple Rashi drishti placeholder: movable aspects fixed, fixed aspects dual, dual aspects movable (oppositions)

def get_rashi_drishti(sign: str) -> List[str]:
    idx = RASHIS.index(sign)
    if idx in [0,3,6,9]:  # movable
        targets = [1,4,7,10]  # fixed
    elif idx in [1,4,7,10]: # fixed
        targets = [2,5,8,11] # dual
    else:                   # dual
        targets = [0,3,6,9] # movable
    return [RASHIS[i] for i in targets]

# -------------------- NAKSHATRA MAPPING --------------------

def map_planets_to_nakshatras(positions: Dict[str, float]) -> Dict[str, Dict[str, Any]]:
    out = {}
    for p, deg in positions.items():
        nak = get_nakshatra(deg)
        pada = get_nakshatra_pada(deg)
        lord = get_nakshatra_lord(nak)
        out[p] = {"nakshatra": nak, "pada": pada, "lord": lord}
    return out

# -------------------- DASHA SYSTEM (Vimshottari) --------------------

def _moon_nakshatra_progress(moon_long: float) -> Tuple[str, float]:
    idx = get_nakshatra_index(moon_long)
    nak = NAKSHATRAS[idx]
    start = idx * NAK_SEG
    prog = (moon_long - start) / NAK_SEG  # 0..1 within current nakshatra
    return nak, prog


def calculate_vimshottari_dasha(jd: float, moon_longitude: float) -> List[Dict[str, Any]]:
    """
    Return list of Mahadashas with start/end datetimes.
    Start point is birth time with balance per Moon's nakshatra progress.
    """
    nak, prog = _moon_nakshatra_progress(moon_longitude)
    lord = get_nakshatra_lord(nak)
    # years remaining in current mahadasha
    rem_years = (1 - prog) * DASHA_YEARS[lord]

    # Build sequence from current lord
    start_idx = DASHA_ORDER.index(lord)
    seq = DASHA_ORDER[start_idx:] + DASHA_ORDER[:start_idx]

    # Base datetime from jd
    cal = swe.revjul(jd)
    start_dt = datetime.datetime(cal[0], cal[1], cal[2]) + datetime.timedelta(days=cal[3])

    dasha_list = []
    curr_start = start_dt

    for i, dlord in enumerate(seq):
        yrs = rem_years if i == 0 else DASHA_YEARS[dlord]
        days = int(yrs * 365.25)
        end_dt = curr_start + datetime.timedelta(days=days)
        dasha_list.append({
            'lord': dlord,
            'start': curr_start,
            'end': end_dt
        })
        curr_start = end_dt
    return dasha_list


def _subperiods(parent_lord: str, parent_start: datetime.datetime, parent_end: datetime.datetime) -> List[Dict[str, Any]]:
    total_days = (parent_end - parent_start).days or 1
    # Proportional division by years of each antardasha lord relative to parent lord
    ad_list = []
    acc = parent_start
    for lord in DASHA_ORDER:
        frac = DASHA_YEARS[lord] / sum(DASHA_YEARS.values())
        span = datetime.timedelta(days=int(total_days * frac))
        end = acc + span
        ad_list.append({'lord': lord, 'start': acc, 'end': end})
        acc = end
    # Adjust last end to parent_end
    if ad_list:
        ad_list[-1]['end'] = parent_end
    return ad_list


def get_current_dasha(dasha_list: List[Dict[str, Any]], date: datetime.datetime) -> Dict[str, Any]:
    for d in dasha_list:
        if d['start'] <= date < d['end']:
            # build antardasha and pratyantar for the found mahadasha
            antar = _subperiods(d['lord'], d['start'], d['end'])
            curr_antar = next((a for a in antar if a['start'] <= date < a['end']), antar[0])
            pratyantar = _subperiods(curr_antar['lord'], curr_antar['start'], curr_antar['end'])
            curr_praty = next((p for p in pratyantar if p['start'] <= date < p['end']), pratyantar[0])
            return {
                'mahadasha': d,
                'antardasha': curr_antar,
                'pratyantar': curr_praty
            }
    return {}

# -------------------- ASHTAKAVARGA (Simplified) --------------------

def calculate_ashtakavarga(positions: Dict[str, float], asc_deg: float) -> Dict[int, int]:
    """Lightweight Sarvashtakavarga-like house scores.
    Heuristic: +1 for each benefic in house; +1 if benefic aspects a house by graha drishti; -1 for malefic resident.
    Range roughly [-n, n].
    """
    houses = get_house_placements(positions, asc_deg)
    aspects = calculate_aspects(positions, asc_deg)
    scores = {h: 0 for h in range(1, 13)}
    for p, h in houses.items():
        if p in BENEFICS:
            scores[h] += 1
        if p in MALEFICS:
            scores[h] -= 1
        # Aspect contributions
        for ah in aspects.get(p, []):
            if p in BENEFICS:
                scores[ah] += 1
            if p in MALEFICS:
                scores[ah] -= 1
    return scores


def calculate_sarvashtakavarga(ashtakavarga_data: Dict[int, int]) -> int:
    return sum(ashtakavarga_data.values())

# -------------------- YOGA UTILITIES --------------------

def is_conjunct(deg1: float, deg2: float, max_diff: float = 10) -> bool:
    return angle_diff(deg1, deg2) <= max_diff


def get_planet_house(chart: Dict[str, Any], planet: str) -> int:
    return chart.get("Houses", {}).get(planet)

def get_planet_sign(chart: Dict[str, Any], planet: str) -> str:
    return chart.get("Signs", {}).get(planet)

def get_planet_degree(chart: Dict[str, Any], planet: str) -> float:
    return chart.get(planet)

def get_lagna(chart: Dict[str, Any]) -> float:
    return chart.get("Lagna", 0)

# -------------------- EXISTING YOGAS --------------------

def detect_gajakesari(chart: Dict[str, Any]):
    if get_planet_house(chart, "Moon") in KENDRA_HOUSES and get_planet_house(chart, "Jupiter") in KENDRA_HOUSES:
        return "🌕 Gajakesari Yoga — Moon and Jupiter in Kendra."


def detect_budhaditya(chart: Dict[str, Any]):
    if get_planet_sign(chart, "Sun") == get_planet_sign(chart, "Mercury") and is_conjunct(get_planet_degree(chart, "Sun"), get_planet_degree(chart, "Mercury")):
        return "☀️ Budhaditya Yoga — Sun and Mercury conjunct."


def detect_chandra_mangala(chart: Dict[str, Any]):
    if get_planet_sign(chart, "Moon") == get_planet_sign(chart, "Mars") and is_conjunct(get_planet_degree(chart, "Moon"), get_planet_degree(chart, "Mars")):
        return "🔥 Chandra-Mangala Yoga — Moon and Mars conjunct."


def detect_dhana_yogas(chart: Dict[str, Any]):
    return [f"💰 Dhana Yoga — {planet} in house {house}."
            for planet in ["Jupiter", "Venus", "Mercury"]
            if (house := get_planet_house(chart, planet)) in [2, 11]]


def detect_vipareeta_raja_yoga(chart: Dict[str, Any]):
    for planet, house in chart.get("Houses", {}).items():
        if house in DUSTHANA_HOUSES:
            lord = RASI_LORDS.get(chart["Signs"].get(planet))
            if lord and get_planet_house(chart, lord) in DUSTHANA_HOUSES:
                return f"🌀 Vipareeta Raja Yoga — {planet} and {lord} in dusthanas."


def detect_kemadruma(chart: Dict[str, Any]):
    moon_house = get_planet_house(chart, "Moon")
    if not moon_house:
        return None
    second = (moon_house % 12) + 1
    twelfth = 12 if moon_house == 1 else moon_house - 1
    occupied = set(chart["Houses"].values())
    if second not in occupied and twelfth not in occupied:
        return "🌑 Kemadruma Yoga — No planets in 2nd and 12th from Moon."


def detect_neecha_bhanga(chart: Dict[str, Any]):
    if get_planet_sign(chart, "Saturn") == "Medam" and get_planet_house(chart, "Saturn") == get_planet_house(chart, "Venus"):
        return "🧱 Neecha Bhanga Raja Yoga — Saturn debilitation cancelled."

# -------------------- MORE YOGAS --------------------

def detect_raja_yogas(chart: Dict[str, Any]) -> List[str]:
    """Kendra lord + Trikona lord association (conjunction or mutual aspect / same house)."""
    lagna = chart.get('Lagna', 0.0)
    if not lagna:
        return []
    lords = get_house_lords(lagna)
    k_lords = {lords[h] for h in KENDRA_HOUSES}
    t_lords = {lords[h] for h in TRIKONA_HOUSES}
    houses = chart.get('Houses', {})
    out = []
    for k in k_lords:
        for t in t_lords:
            if k in houses and t in houses and houses[k] == houses[t]:
                out.append(f"👑 Raja Yoga — {k} (Kendra lord) with {t} (Trikona lord) in house {houses[k]}.")
    return out


def detect_parivartana_yoga(chart: Dict[str, Any]) -> List[str]:
    signs = chart.get('Signs', {})
    out = []
    for p1, s1 in signs.items():
        lord1 = get_rasi_lord(s1)
        if lord1 not in signs:
            continue
        s2 = signs[lord1]
        lord2 = get_rasi_lord(s2)
        if lord2 == p1 and p1 != lord1:
            out.append(f"🔁 Parivartana Yoga — {p1} ↔ {lord1} exchange signs {s1} ↔ {s2}.")
    return list(dict.fromkeys(out))


def detect_panch_mahapurusha(chart: Dict[str, Any]) -> List[str]:
    """
    Ruchaka (Mars), Bhadra (Mercury), Hamsa (Jupiter), Malavya (Venus), Shasha (Saturn):
    Planet in own/exalted sign in a Kendra (1/4/7/10) (ignoring combustion/retro for simplicity).
    """
    targets = {
        'Mars': 'Ruchaka', 'Mercury': 'Bhadra', 'Jupiter': 'Hamsa', 'Venus': 'Malavya', 'Saturn': 'Shasha'
    }
    out = []
    for p, yoga in targets.items():
        sign = get_planet_sign(chart, p)
        house = get_planet_house(chart, p)
        if not sign or not house:
            continue
        status = get_exaltation_status(p, chart[p])
        if (get_rasi_lord(sign) == p or status == 'Exalted') and house in KENDRA_HOUSES:
            out.append(f"🏛️ {yoga} Yoga — {p} strong in Kendra ({house}) in {sign}.")
    return out


def detect_arishta_bhanga(chart: Dict[str, Any]) -> List[str]:
    out = []
    # Simple rule: Benefic aspect or conjunction on Lagna/Moon cancels afflictions
    moon_h = get_planet_house(chart, 'Moon')
    lagna_h = 1
    occupied = chart.get('Houses', {})
    for p in BENEFICS:
        if occupied.get(p) in [lagna_h, moon_h]:
            out.append(f"🛡️ Arishta Bhanga — {p} protects Lagna/Moon.")
    return out


def detect_lakshmi_yoga(chart: Dict[str, Any]) -> List[str]:
    out = []
    # Simplified: Lagna lord strong and placed in Kendra/Trikona with benefic association
    lagna = chart.get('Lagna', 0.0)
    if not lagna:
        return out
    lords = get_house_lords(lagna)
    lagna_lord = lords[1]
    h = get_planet_house(chart, lagna_lord)
    if h in KENDRA_HOUSES + TRIKONA_HOUSES:
        for b in BENEFICS:
            if get_planet_house(chart, b) == h:
                out.append(f"💮 Lakshmi Yoga — Lagna lord {lagna_lord} strong with {b} in house {h}.")
                break
    return out


def detect_saraswati_yoga(chart: Dict[str, Any]) -> List[str]:
    out = []
    # Simplified: Jupiter, Venus, Mercury strong and connected to 2/5/9 houses
    target_houses = {2,5,9}
    houses = chart.get('Houses', {})
    if all(houses.get(p) in target_houses for p in ["Jupiter","Venus","Mercury"]):
        out.append("🎓 Saraswati Yoga — Jupiter, Venus, Mercury favor 2/5/9.")
    return out


def detect_dhanya_yoga(chart: Dict[str, Any]) -> List[str]:
    out = []
    # Simplified: 2nd lord in 11th, 11th lord in 2nd (wealth circuit)
    lagna = chart.get('Lagna', 0.0)
    if not lagna:
        return out
    lords = get_house_lords(lagna)
    h = chart.get('Houses', {})
    if h.get(lords[2]) == 11 and h.get(lords[11]) == 2:
        out.append("🪙 Dhanya Yoga — Strong 2–11 wealth exchange.")
    return out

# -------------------- DOSHAS --------------------

def detect_manglik_dosha(chart: Dict[str, Any]) -> str:
    # Mars in 1,2,4,7,8,12 from Lagna or Moon
    mars_h = get_planet_house(chart, 'Mars')
    moon_h = get_planet_house(chart, 'Moon')
    if mars_h in [1,2,4,7,8,12] or ((mars_h - moon_h) % 12) + 1 in [1,2,4,7,8,12]:
        return "⚠️ Manglik (Kuja) Dosha present (simplified rule)."


def detect_kaal_sarp_dosha(chart: Dict[str, Any]) -> str:
    # All planets within Rahu–Ketu axis without any planet outside
    rahu = chart.get('Rahu')
    ketu = chart.get('Ketu')
    if rahu is None or ketu is None:
        return None
    start = min(rahu, ketu)
    end = max(rahu, ketu)
    inside = 0
    outside = 0
    for p in ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn']:
        deg = chart.get(p)
        if deg is None: continue
        if start <= deg <= end:
            inside += 1
        else:
            outside += 1
    if outside == 0:
        return "🐍 Kaal Sarp Dosha indicated (all planets within Rahu–Ketu arc)."


def detect_pitra_dosha(chart: Dict[str, Any]) -> str:
    # Simplified: Sun afflicted by Rahu/Ketu or Saturn (conjunction)
    sun = chart.get('Sun')
    for mal in ['Rahu','Ketu','Saturn']:
        if is_conjunct(sun, chart.get(mal, -100), 8):
            return "🧬 Pitra Dosha (Sun afflicted by nodes/Saturn)."

# -------------------- HOUSE-SPECIFIC STRENGTHS --------------------

def get_strongest_house(chart: Dict[str, Any]) -> Tuple[int, int]:
    # Use simplified ashtakavarga score
    asc = chart.get('Lagna', 0.0)
    av = calculate_ashtakavarga({k: chart[k] for k in PLANET_CODES.keys()}, asc)
    best = max(av.items(), key=lambda x: x[1])
    return best


def analyze_empty_houses(chart: Dict[str, Any]) -> List[str]:
    occupied = chart.get('Houses', {})
    empty = [h for h in range(1,13) if h not in occupied.values()]
    lords = get_house_lords(chart.get('Lagna', 0.0))
    out = []
    for h in empty:
        lord = lords[h]
        lord_house = occupied.get(lord)
        out.append(f"House {h} empty; lord {lord} placed in house {lord_house} (dispositor strength matters).")
    return out


def check_benefic_malefic_in_kendras_trikonas(chart: Dict[str, Any]) -> Dict[str, Any]:
    houses = chart.get('Houses', {})
    res = {
        'benefics_in_kendra': [p for p in BENEFICS if houses.get(p) in KENDRA_HOUSES],
        'benefics_in_trikona': [p for p in BENEFICS if houses.get(p) in TRIKONA_HOUSES],
        'malefics_in_kendra': [p for p in MALEFICS if houses.get(p) in KENDRA_HOUSES],
        'malefics_in_trikona': [p for p in MALEFICS if houses.get(p) in TRIKONA_HOUSES],
    }
    return res

# -------------------- MAIN YOGA DETECTION --------------------

def detect_yogas(chart: Dict[str, Any]) -> List[str]:
    detectors = [
        detect_gajakesari, detect_budhaditya, detect_chandra_mangala,
        detect_dhana_yogas, detect_vipareeta_raja_yoga,
        detect_kemadruma, detect_neecha_bhanga,
        # More
        detect_raja_yogas, detect_parivartana_yoga, detect_panch_mahapurusha,
        detect_arishta_bhanga, detect_lakshmi_yoga, detect_saraswati_yoga,
        detect_dhanya_yoga,
    ]
    yogas = []
    for detect in detectors:
        result = detect(chart)
        if result:
            yogas.extend(result if isinstance(result, list) else [result])
    return yogas

# -------------------- TRANSITS (GOCHAR) --------------------

def get_current_transits(date_str: str, time_str: str, lat: float, lon: float) -> Dict[str, float]:
    return get_planet_positions(date_str, time_str, lat, lon)


def analyze_saturn_transit(natal_moon_long: float, current_saturn_long: float) -> str:
    natal_moon_sign = int(natal_moon_long // 30)
    sat_sign = int(current_saturn_long // 30)
    rel = (sat_sign - natal_moon_sign) % 12
    if rel in [12, 1, 2]:
        return "🪐 Sade-Sati phase (Saturn 12th/1st/2nd from Moon)."
    if rel in [4, 8]:
        return "🪐 Dhaiya/Kantaka Shani (Saturn 4th/8th from Moon)."


def analyze_jupiter_transit(natal_moon_long: float, current_jupiter_long: float) -> str:
    natal_moon_sign = int(natal_moon_long // 30)
    j_sign = int(current_jupiter_long // 30)
    rel = (j_sign - natal_moon_sign) % 12
    if rel in [2,5,7,9,11]:
        return "♃ Jupiter transit favorable from Moon (2/5/7/9/11)."
    return "♃ Jupiter transit neutral/challenging currently."

# -------------------- ORCHESTRATOR --------------------

def generate_professional_birth_chart(date_str: str, time_str: str, lat: float, lon: float) -> Dict[str, Any]:
    # Base JD
    year, month, day = map(int, date_str.split('-'))
    hour, minute = map(int, time_str.split(':'))
    dt = datetime.datetime(year, month, day, hour, minute)
    dt_utc = dt - datetime.timedelta(hours=5, minutes=30)
    ut_hour = dt_utc.hour + dt_utc.minute / 60.0
    jd = swe.julday(dt_utc.year, dt_utc.month, dt_utc.day, ut_hour)

    # Planets
    pos = get_planet_positions(date_str, time_str, lat, lon)
    pos_spd = get_planet_positions_with_speed(jd)

    # Lagna
    asc_deg, asc_sign = calculate_lagna(jd, lat, lon)

    # Core chart
    signs = {p: get_sign_name(d) for p, d in pos.items()}
    houses = get_house_placements(pos, asc_deg)

    # Strengths
    exalt = {p: get_exaltation_status(p, pos[p]) for p in pos}
    combust = {p: is_combust(p, pos[p], pos['Sun']) for p in pos}
    retro = {p: (pos_spd.get(p, (0,0))[1] < 0) for p in pos}
    shadbala = calculate_shadbala(pos)
    avastha = {p: get_baladi_avastha(p, pos[p]) for p in pos}

    # Vargas
    d3 = calculate_drekkana_chart(pos)
    d4 = calculate_chaturthamsa_chart(pos)
    d9 = calculate_navamsa_chart(pos)
    d10 = calculate_dasamsa_chart(pos)

    # Nakshatra details
    moon_nak = get_nakshatra(pos['Moon'])
    moon_pada = get_nakshatra_pada(pos['Moon'])
    moon_nak_lord = get_nakshatra_lord(moon_nak)
    planet_naks = map_planets_to_nakshatras(pos)

    # Dasha
    mahadashas = calculate_vimshottari_dasha(jd, pos['Moon'])
    now = dt  # birth moment; caller can pass another date for current
    current_dasha = get_current_dasha(mahadashas, now)

    # Ashtakavarga (simplified)
    av_scores = calculate_ashtakavarga(pos, asc_deg)
    sav_total = calculate_sarvashtakavarga(av_scores)

    # Aspects
    graha_aspects = calculate_aspects(pos, asc_deg)

    # Yogas + Doshas
    chart = {
        **pos,
        'Lagna': asc_deg,
        'Signs': signs,
        'Houses': houses
    }
    yogas = detect_yogas(chart)
    doshas = [
        detect_manglik_dosha(chart),
        detect_kaal_sarp_dosha(chart),
        detect_pitra_dosha(chart)
    ]
    doshas = [d for d in doshas if d]

    # Transits snapshot = same moment (caller can compute for today separately)
    saturn_assess = analyze_saturn_transit(pos['Moon'], pos['Saturn'])
    jupiter_assess = analyze_jupiter_transit(pos['Moon'], pos['Jupiter'])

    return {
        'datetime_ist': dt,
        'jd': jd,
        'ascendant': {'degree': asc_deg, 'sign': asc_sign},
        'positions': pos,
        'signs': signs,
        'houses': houses,
        'strengths': {
            'exaltation_status': exalt,
            'combustion': combust,
            'retrograde': retro,
            'shadbala_simplified': shadbala,
            'baladi_avastha': avastha,
        },
        'vargas': {
            'D3': d3,
            'D4': d4,
            'D9': d9,
            'D10': d10,
        },
        'nakshatra': {
            'moon': {'nakshatra': moon_nak, 'pada': moon_pada, 'lord': moon_nak_lord},
            'planet_mapping': planet_naks,
        },
        'dasha': {
            'mahadashas': mahadashas,
            'current': current_dasha,
        },
        'ashtakavarga_simplified': {
            'house_scores': av_scores,
            'sarvashtakavarga_total': sav_total,
        },
        'aspects': graha_aspects,
        'yogas': yogas,
        'doshas': doshas,
        'transits_snapshot': {
            'saturn': saturn_assess,
            'jupiter': jupiter_assess,
        }
    }

# -------------------- HELPER: QUICK RUN --------------------
if __name__ == "__main__":
    # Example: 1995-01-01 12:00 IST, Delhi (28.6139N, 77.2090E)
    report = generate_professional_birth_chart("1995-01-01", "12:00", 28.6139, 77.2090)
    # Print a concise summary
    print("Ascendant:", format_deg(report['ascendant']['degree']))
    print("Moon Nakshatra:", report['nakshatra']['moon'])
    print("Top Yogas:", report['yogas'][:5])
    print("Doshas:", report['doshas'])
