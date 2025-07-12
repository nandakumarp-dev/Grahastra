from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import requests
from django.conf import settings

def send_email(subject, recipient, template, context):
    # Render HTML content from template
    html_content = render_to_string(template, context)

    # Create plain text fallback
    text_content = strip_tags(html_content)

    # Create email message
    mail = EmailMultiAlternatives(
        subject=subject,
        body=text_content,  # plain text version
        from_email=settings.EMAIL_HOST_USER,
        to=[recipient]
    )

    mail.attach_alternative(html_content, "text/html")
    mail.send()


def get_coordinates_from_place(pob):
    
    api_key = settings.OPENCAGE_API_KEY
    url = f'https://api.opencagedata.com/geocode/v1/json?q={pob}&key={api_key}&limit=1'

    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()

        if data['results']:
            geometry = data['results'][0]['geometry']
            return geometry['lat'], geometry['lng']
    except Exception as e:
        print("Geocoding error:", e)

    return None, None