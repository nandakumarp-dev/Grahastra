from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags

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

    # Send email
    mail.send()
