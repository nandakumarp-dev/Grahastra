from django.views import View
from django.http import JsonResponse
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render, redirect
from .models import AstroQuery
from core.astrology_utils import get_planet_positions, get_birth_chart_data, calculate_lagna, get_nakshatra, get_rasi_lord, get_nakshatra_lord
from decouple import config
from datetime import datetime, timedelta, date
import swisseph as swe
import requests
import logging
from django.contrib.auth.decorators import login_required


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
            return JsonResponse({"error": "Please ask a question."}, status=400)

        profile = getattr(user, "profile", None)
        if not profile:
            return JsonResponse({"error": "User profile not found."}, status=400)

        try:
            # Step 1: Calculate chart
            birth_dt = datetime.combine(profile.birth_date, profile.birth_time)
            dt_utc = birth_dt - timedelta(hours=5, minutes=30)
            jd = swe.julday(dt_utc.year, dt_utc.month, dt_utc.day, dt_utc.hour + dt_utc.minute / 60.0)

            asc_deg, lagna_sign = calculate_lagna(jd, profile.latitude, profile.longitude)
            positions = get_planet_positions(
                profile.birth_date.strftime('%Y-%m-%d'),
                profile.birth_time.strftime('%H:%M'),
                profile.latitude,
                profile.longitude
            )
            chart_data = get_birth_chart_data(positions, profile.nakshatra, asc_deg)

            # Step 2: Prepare planet lines
            planet_lines = self.get_planet_description(positions, chart_data)
            yoga_lines = chart_data.get("Yogas", [])

            # Step 3: Past context
            prev_qna = AstroQuery.objects.filter(user=user).order_by("-created_at")[:3]
            prev_summary = "\n".join([f"Q: {q.question}\nA: {q.answer}" for q in reversed(prev_qna)])

            age = (date.today() - profile.birth_date).days // 365

            # Step 4: Build prompt
            prompt = self.build_prompt(chart_data, planet_lines, yoga_lines, question, prev_summary, age)

            # Step 5: Get AI response
            response = self.send_to_ai(prompt)
            answer = self.extract_answer(response)

            # Step 6: Save chat
            AstroQuery.objects.create(user=user, question=question, answer=answer)

            return JsonResponse({"question": question, "answer": answer})

        except Exception as e:
            logger.exception("Unexpected error during astrology processing.")
            return JsonResponse({"error": f"Internal error: {str(e)}"}, status=500)

    def get_planet_description(self, positions, chart_data):
        lines = []
        for planet, degree in positions.items():
            sign = chart_data["Signs"].get(planet)
            house = chart_data["Houses"].get(planet)
            nak = get_nakshatra(degree)
            rasi_lord = get_rasi_lord(sign)
            nak_lord = get_nakshatra_lord(nak)
            lines.append(
                f"- {planet}: {sign} ({degree:.2f}°) in House {house}, Nakshatra: {nak} | "
                f"Sign Lord: {rasi_lord}, Nakshatra Lord: {nak_lord}"
            )
        return lines

    def build_prompt(self, chart_data, planet_lines, yoga_lines, question, previous_summary, age):
        now = datetime.now()
        current_date = now.strftime("%d %B %Y")
        current_time = now.strftime("%I:%M %p")
        current_year = now.year

        return f"""
    You are a highly experienced and practical Indian Vedic astrologer. Your role is to give serious, accurate insights based on full birth chart analysis using classical Vedic rules — planetary positions, houses, aspects, yogas, and timing logic.

    Here are the user's birth details and context. Use this information to give a precise, realistic answer.

    📅 Today: {current_date} ({current_time}, IST)
    📆 Year: {current_year}
    🎂 Birth Date: {chart_data.get('BirthDate', 'Not Available')}
    🎂 Age: {age} years

    🔁 Previous Q&A:
    {previous_summary or "None"}

    🌌 Birth Chart:
    - Ascendant (Lagna): {chart_data.get("Lagna")}
    - Nakshatra: {chart_data.get("Nakshatra")}
    - Planetary Positions:
    {chr(10).join(planet_lines)}

    🔍 Yogas Detected:
    {chr(10).join(yoga_lines) or "None"}

    ❓ Current Question:
    "{question}"

    📌 Instructions:
    - Respond like a real Indian astrologer would in a personal consultation.
    - Base the answer on actual houses, yogas, and transits if needed.
    - If timing is asked (e.g. marriage), estimate based on age, transit, or Mahadasha logic.
    - Do not include spiritual phrases or affirmations like “Namaste” or “The universe will align”.
    - Use 5–7 crisp, grounded, chart-based sentences.
    - Be realistic, direct, and professional — not motivational or generic.

    📝 Final Answer:
    """.strip()


    def send_to_ai(self, prompt):
        headers = {
            "Authorization": f"Bearer {TOGETHER_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "mistralai/Mistral-7B-Instruct-v0.2",
            "prompt": prompt,
            "max_tokens": 1000,
            "temperature": 0.7
        }
        response = requests.post(TOGETHER_URL, headers=headers, json=payload, timeout=30)
        if response.status_code != 200:
            raise Exception(f"API request failed with {response.status_code}: {response.text}")
        return response.json()

    def extract_answer(self, response_json):
        try:
            text = response_json["output"]["choices"][0].get("text", "").strip()
            if not text:
                return self.fallback_message()
            return text
        except (KeyError, IndexError, TypeError):
            return self.fallback_message()

    def fallback_message(self):
        return "Your chart couldn't be interpreted properly right now. Please try again with a slightly reworded question."



@login_required
def clear_astro_chats(request):

    if request.method == "POST":

        AstroQuery.objects.filter(user=request.user).delete()

    return redirect("ask_astrology")