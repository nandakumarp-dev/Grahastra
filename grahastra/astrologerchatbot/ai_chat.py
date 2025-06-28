# import openai

def generate_astrology_response(question, chart_data):
#     """
#     Uses OpenAI GPT to generate an astrologically informed response.
#     Birth chart data is passed in to ensure personalized, accurate analysis.
#     """

#     prompt = f"""
# You are a professional Vedic astrologer with decades of experience. A user has asked a question, and below is their accurate birth chart data. Based only on this chart, give a clear, astrological answer. Do NOT give generic advice. Always refer to the planetary placements.

# User's Question:
# {question}

# User's Birth Chart:
# - Lagna (Ascendant Degree): {chart_data.get('Lagna')}
# - Nakshatra: {chart_data.get('Nakshatra')}
# - Planetary Houses: {chart_data.get('Houses')}
# - Planetary Signs: {chart_data.get('Signs')}

# Respond like an expert astrologer, using real Vedic logic (10th house for career, 7th for marriage, 2nd/11th for money, 6th for health, etc.). Be specific and confident in your analysis.
# """

#     response = openai.ChatCompletion.create(
#         model="gpt-4",
#         messages=[
#             {"role": "system", "content": "You are a Vedic astrologer chatbot."},
#             {"role": "user", "content": prompt}
#         ],
#         temperature=0.6,
#         max_tokens=500
#     )

    return response.choices[0].message.content.strip()