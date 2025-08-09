import uuid
from django.db import models
from django.conf import settings

class PremiumPlan(models.Model):
    PLAN_CHOICES = [
        ('basic', 'Basic'),
        ('pro', 'Pro'),
        ('lifetime', 'Lifetime'),
    ]
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(choices=PLAN_CHOICES, max_length=50, unique=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self):
        return self.name

class PremiumTransaction(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    plan = models.ForeignKey(PremiumPlan, on_delete=models.SET_NULL, null=True)
    amount = models.DecimalField(max_digits=8, decimal_places=2)
    status = models.CharField(max_length=20, choices=[
        ('Initiated', 'Initiated'), 
        ('Success', 'Success'), 
        ('Failed', 'Failed')
    ])
    rzp_order_id = models.CharField(max_length=100, null=True, blank=True)
    rzp_payment_id = models.CharField(max_length=100, null=True, blank=True)
    rzp_payment_signature = models.CharField(max_length=100, null=True, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.plan.name} - {self.status}"
