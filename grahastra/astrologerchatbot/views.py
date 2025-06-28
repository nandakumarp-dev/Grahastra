from django.views import View
from django.http import JsonResponse
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render
from .models import AstroQuery
from core.astrology_utils import get_planet_positions, get_birth_chart_data, calculate_lagna, get_nakshatra, get_rasi_lord, get_nakshatra_lord
from decouple import config
from datetime import datetime, timedelta
import swisseph as swe
import requests
import logging
import json

TOGETHER_API_KEY = config("TOGETHER_API_KEY")
TOGETHER_URL = "https://api.together.xyz/inference"

logger = logging.getLogger(__name__)

class AskAstrologyView(LoginRequiredMixin, View):
    def get(self, request):
        chats = AstroQuery.objects.filter(user=request.user).order_by("created_at")
        return render(request, "dashboard/ask_astrology_page.html", {"chats": chats})

    def post(self, request):
        question = request.POST.get("question", "").strip()
        user = request.user

        if not question:
            return JsonResponse({"error": "Empty question"}, status=400)

        profile = getattr(user, 'profile', None)
        if not profile:
            return JsonResponse({"error": "User profile not found."}, status=400)

        try:
            dt = datetime.combine(profile.birth_date, profile.birth_time)
            dt_utc = dt - timedelta(hours=5, minutes=30)
            jd = swe.julday(dt_utc.year, dt_utc.month, dt_utc.day, dt_utc.hour + dt_utc.minute / 60.0)

            asc_deg, lagna_sign = calculate_lagna(jd, profile.latitude, profile.longitude)

            positions = get_planet_positions(
                profile.birth_date.strftime('%Y-%m-%d'),
                profile.birth_time.strftime('%H:%M'),
                profile.latitude,
                profile.longitude
            )
            chart_data = get_birth_chart_data(positions, profile.nakshatra, asc_deg)

            planet_lines = []
            for planet, degree in positions.items():
                sign = chart_data["Signs"].get(planet)
                house = chart_data["Houses"].get(planet)
                nak = get_nakshatra(degree)
                rasi_lord = get_rasi_lord(sign)
                nak_lord = get_nakshatra_lord(nak)

                planet_lines.append(
                    f"- {planet}: {sign} ({degree:.2f}°) in House {house}, Nakshatra: {nak} | "
                    f"Sign Lord: {rasi_lord}, Nakshatra Lord: {nak_lord}"
                )

            yoga_lines = chart_data.get("Yogas", [])

            now = datetime.now()
            current_date = now.strftime("%d %B %Y")
            current_time = now.strftime("%I:%M %p")

            prompt = f"""
You are a professional Vedic astrologer. Analyze the birth chart and answer the user's question simply and clearly.

Current Date: {current_date}
Current Time: {current_time}
Time Zone: IST (+5:30)

User's Birth Chart:
- Ascendant (Lagna): {chart_data.get("Lagna")}
- Nakshatra: {chart_data.get("Nakshatra")}
- Planetary Positions:
{chr(10).join(planet_lines)}

Detected Yogas:
{chr(10).join(yoga_lines) or "None"}

User's Question: "{question}"

Reply in 4 to 5 simple lines. Use plain language anyone can understand.
Do not list planetary or house details. Avoid technical terms.
Focus on what the person can expect and give one clear suggestion.
"""

            headers = {
                "Authorization": f"Bearer {TOGETHER_API_KEY}",
                "Content-Type": "application/json"
            }

            payload = {
                "model": "mistralai/Mistral-7B-Instruct-v0.2",
                "prompt": prompt.strip(),
                "max_tokens": 600,
                "temperature": 0.7
            }

            response = requests.post(TOGETHER_URL, headers=headers, json=payload, timeout=30)

            if response.status_code != 200:
                logger.error(f"API error {response.status_code}: {response.text}")
                return JsonResponse({"error": "API request failed. Please try again."}, status=500)

            result = response.json()
            print("🟡 TOGETHER RAW RESPONSE:\n", json.dumps(result, indent=2))

            try:
                answer = result["output"]["choices"][0].get("text", "").strip()
                if not answer:
                    answer = "The astrologer gave no response. Try rephrasing."
                # Enforce 4–5 line limit
                sentences = answer.split(".")
                if len(sentences) > 5:
                    answer = ".".join(sentences[:5]).strip() + "."
            except (KeyError, IndexError, TypeError) as e:
                print("❌ Failed to extract answer:", str(e))
                answer = "I couldn't interpret the chart. Please try again."

        except Exception as e:
            logger.exception("Unexpected error during astrology processing.")
            return JsonResponse({"error": f"Internal error: {str(e)}"}, status=500)

        AstroQuery.objects.create(user=user, question=question, answer=answer)

        print("✅ Returning to frontend:", {"question": question, "answer": answer})
        return JsonResponse({"question": question, "answer": answer})



from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect

@login_required
def clear_astro_chats(request):
    if request.method == "POST":
        AstroQuery.objects.filter(user=request.user).delete()
    return redirect("ask_astrology")