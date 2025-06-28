import requests
from decouple import config

API_KEY = config('TOGETHER_API_KEY')

def query_gpt(prompt: str) -> str:
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "meta-llama/Meta-Llama-3-70B-Instruct-Turbo",
        "messages": [
            {"role": "system", "content": "You are a helpful Vedic astrologer who gives simple, clear answers."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
        "top_p": 0.9,
        "max_tokens": 500
    }
    try:
        response = requests.post(
            "https://api.together.xyz/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=60
        )
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        return f"API Error: {e}"