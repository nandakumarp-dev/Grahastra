import requests

def query_llama(prompt: str) -> str:
    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama3",
                "prompt": prompt,
                "stream": False
            },
            timeout=300  # ← Increase timeout to 5 minutes
        )
        return response.json().get("response", "")
    except Exception as e:
        return f"AI Error: {e}"
