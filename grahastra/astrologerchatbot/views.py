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
            # Chart setup
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
            planet_lines = self.get_planet_description(positions, chart_data)
            yoga_lines = chart_data.get("Yogas", [])
            prev_qna = AstroQuery.objects.filter(user=user).order_by("-created_at")[:3]
            prev_summary = "\n".join([f"Q: {q.question}\nA: {q.answer}" for q in reversed(prev_qna)])
            age = (date.today() - profile.birth_date).days // 365

            # Step 1: Ask AI to classify question type
            intent_prompt = f"""
You are an expert Vedic astrologer. A user has asked this question:

"{question}"

What is the intent behind this question? Return ONLY the category label.

Use one of the following labels:
- marriage_timing
- married_life
- career
- health
- children
- foreign_travel
- wealth
- education
- spiritual
- general_astrology

Only return the label. Do not explain.
""".strip()

            intent_response = self.send_to_ai(intent_prompt, temperature=0.0)
            question_type = self.extract_text(intent_response).lower().strip()

            # Step 2: Now send full prompt for astrology answer
            full_prompt = self.build_prompt(
                chart_data, planet_lines, yoga_lines, question, question_type, prev_summary, age
            )
            response = self.send_to_ai(full_prompt, temperature=0.4)
            answer = self.extract_answer(response)

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

    def build_prompt(self, chart_data, planet_lines, yoga_lines, question, question_type, previous_summary, age):
        now = datetime.now()
        return f"""
You are a professional Vedic astrologer. Analyze the following birth chart and give a clear, accurate answer.

🧠 Question Type: {question_type}
❓ Question: "{question}"
🎂 Age: {age} years
📅 Date: {now.strftime('%d %B %Y, %I:%M %p')} IST

📈 Chart Summary:
- Lagna: {chart_data.get("Lagna")}
- Nakshatra: {chart_data.get("Nakshatra")}
- Planetary Positions:
{chr(10).join(planet_lines)}

🔍 Yogas:
{chr(10).join(yoga_lines) or "None"}

📌 Instructions:
- NEVER suggest the user consult an astrologer.
- Focus your interpretation on the type of question.
- For "marriage_timing", analyze 7th house, Venus/Jupiter, Dasha, and Jupiter/Saturn transits.
- For "career", analyze 10th, 11th house, Saturn, Mercury, 6th lord, and Mahadasha/Antardasha.
- Use actual astrological logic: dashas, aspects, transits, yogas, strengths, afflictions.
- Write 5–7 sentences — professional, direct, realistic.

📝 Final Answer:
""".strip()

    def send_to_ai(self, prompt, temperature=0.4):
        headers = {
            "Authorization": f"Bearer {TOGETHER_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "mistralai/Mistral-7B-Instruct-v0.2",
            "prompt": prompt,
            "max_tokens": 1000,
            "temperature": temperature
        }
        response = requests.post(TOGETHER_URL, headers=headers, json=payload, timeout=30)
        if response.status_code != 200:
            raise Exception(f"API request failed with {response.status_code}: {response.text}")
        return response.json()

    def extract_text(self, response_json):
        return response_json.get("output", {}).get("choices", [{}])[0].get("text", "").strip()

    def extract_answer(self, response_json):
        try:
            text = self.extract_text(response_json)
            for phrase in [
                "consult a professional astrologer",
                "this is a general prediction",
                "may vary depending on the individual",
                "your path may differ",
                "seek expert opinion"
            ]:
                text = text.replace(phrase, "")
            return text.strip()
        except Exception:
            return self.fallback_message()

    def fallback_message(self):
        return "The AI could not interpret your chart right now. Please rephrase and try again."


@login_required
def clear_astro_chats(request):

    if request.method == "POST":

        AstroQuery.objects.filter(user=request.user).delete()

    return redirect("ask_astrology")