from django.db import models
from django.db import models
from django.contrib.auth import get_user_model


User = get_user_model()

class AstroQuery(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.TextField()
    answer = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
