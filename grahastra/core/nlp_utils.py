from datetime import datetime
from core.llm import query_llama

def detect_intent_and_generate_answer(question, chart_data):
    today = datetime.now().strftime("%B %d, %Y")

    SYSTEM_PROMPT = (
        "You are a wise and compassionate Vedic astrologer. "
        "Explain things clearly, using simple language that anyone can understand — "
        "as if you are speaking to a curious, non-astrologer friend. "
        "Avoid complex jargon unless necessary, and use plain explanations with relatable examples."
    )

    # Format planetary positions
    planet_lines = "\n".join([
        f"- {planet}: {deg}°" for planet, deg in chart_data.items()
        if planet in ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']
    ])

    # Format house placements
    house_data = chart_data.get("Houses", {})
    house_lines = "\n".join([
        f"- {planet}: House {house}" for planet, house in house_data.items()
    ]) if house_data else "House data not available."

    yoga_lines = "\n".join(chart_data.get("Yogas", [])) or "No special yogas detected."


    lagna = chart_data.get("Lagna", "Unknown")
    nakshatra = chart_data.get("Nakshatra", "Unknown")

    full_prompt = f"""
{SYSTEM_PROMPT}

Today's date: {today}

User's Birth Chart:
- Lagna (Ascendant): {lagna}
- Moon Nakshatra: {nakshatra}

Planetary Positions:
{planet_lines}

House Placements:
{house_lines}

Yoga Indicators:
{yoga_lines}

User's Question:
{question}

Your Answer:
"""

    return query_llama(full_prompt)
