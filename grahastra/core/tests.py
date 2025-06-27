from django.test import TestCase

# Create your tests here.
from decouple import config

API_KEY = config('TOGETHER_API_KEY')

import requests

# API_KEY = "your_api_key_here"
headers = {
    "Authorization": f"Bearer {API_KEY}"
}

response = requests.get("https://api.together.xyz/v1/models", headers=headers)
print(response.status_code)
print(response.text)