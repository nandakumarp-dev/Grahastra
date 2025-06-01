import requests

from decouple import config

TOGETHER_API_KEY = config('TOGETHER_API_KEY')

def detect_intent_and_generate_answer(question, chart_data):
    prompt = f"""
You are a traditional Vedic astrologer. Here's the user's birth chart:

{chart_data}

They asked: "{question}"

First, understand what they're asking (e.g., marriage, career, health, property).
Then, based on the chart, give an astrology-based answer in Malayalam with empathy.
"""

    response = requests.post(
        "https://api.together.xyz/inference",
        headers={"Authorization": f"Bearer {TOGETHER_API_KEY}"},
        json={
            "model": "deepseek-chat",
            "messages": [{"role": "user", "content": prompt}]
        }
    )

    if response.status_code == 200:
        return response.json()["output"]["choices"][0]["message"]["content"]
    else:
        return "ക്ഷമിക്കണം, അതിയായ തിരക്കിലാണ്. പിന്നീട് വീണ്ടും ശ്രമിക്കുക."
