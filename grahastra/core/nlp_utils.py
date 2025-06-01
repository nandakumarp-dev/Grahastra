import requests
from decouple import config

import re

TOGETHER_API_KEY = config('TOGETHER_API_KEY')

def detect_intent_and_generate_answer(question, chart_data):
    prompt = f"""
Here is the user's birth chart: {chart_data}

Question: "{question}"

You are a wise and kind Vedic astrologer. Provide an insightful answer in fluent, gentle English. Avoid repetition. Make it sound personal and helpful.

"""

    try:
        response = requests.post(
            "https://api.together.xyz/inference",
            headers={"Authorization": f"Bearer {TOGETHER_API_KEY}"},
            json={
                "model": "mistralai/Mistral-7B-Instruct-v0.2",
                "messages": [{"role": "system", "content": "You are a Vedic astrologer. Reply in fluent English with empathy."},
  {"role": "user", "content": prompt}]
            },
            timeout=15
        )

        print("STATUS:", response.status_code)
        print("BODY:", response.text)

        if response.status_code == 200:
            raw = response.json()["output"]["choices"][0]["text"]
            return raw
        
        else:
            return "ക്ഷമിക്കണം, DeepSeek സെർവറിൽ പിഴവുണ്ടായി. വീണ്ടും ശ്രമിക്കുക."

    except Exception as e:
        print("DeepSeek API Error:", e)
        return "ക്ഷമിക്കണം, ഇപ്പോൾ ഉത്തരമില്ല. പിന്നീട് വീണ്ടും ശ്രമിക്കുക."



# def clean_malayalam_output(text):
#     # Remove excessive repetition
#     lines = text.split('\n')
#     unique_lines = list(dict.fromkeys(lines))  # removes duplicate lines
#     result = '\n'.join(unique_lines)

#     # Optional: truncate repeating phrases
#     result = re.sub(r'(.*?)\1+', r'\1', result)
#     return result.strip()