from django.views import View
from django.shortcuts import render, get_object_or_404, redirect
from decouple import config
import razorpay
from .models import PremiumPlan, PremiumTransaction
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils import timezone

# Premium Upgrade Listing Page
class PremiumUpgradeView(LoginRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        plans = PremiumPlan.objects.all()
        return render(request, 'payment/premium_upgrade.html', {'plans': plans})


# Payment Page for Selected Plan
class PremiumPaymentView(LoginRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        plan_type = kwargs.get('plan')  # Example: 'basic', 'pro', 'lifetime'
        plan = get_object_or_404(PremiumPlan, name=plan_type)

        # Setup Razorpay
        client = razorpay.Client(auth=(config('RZP_CLIENT_ID'), config('RZP_CLIENT_SECRET')))
        amount_in_paise = int(plan.price * 100)

        # Create Razorpay Order
        order_data = {
            "amount": amount_in_paise,
            "currency": "INR",
            "receipt": f"receipt_{plan.name}_{request.user.id}",
            "payment_capture": 1
        }
        razorpay_order = client.order.create(data=order_data)

        # Save Transaction Temporarily
        transaction = PremiumTransaction.objects.create(
            user=request.user,
            plan=plan,
            amount=plan.price,
            status='Initiated',
            rzp_order_id=razorpay_order['id']
        )

        # Pass data to template
        context = {
            "plan": plan,
            "razorpay_order_id": razorpay_order["id"],
            "razorpay_merchant_key": config('RZP_CLIENT_ID'),
            "amount": amount_in_paise,
            "currency": "INR",
            "user_email": request.user.email,
            "user_name": request.user.first_name or request.user.username,
        }

        return render(request, "payment/premium_checkout.html", context)



class VerifyPremiumPaymentView(LoginRequiredMixin, View):
    def post(self, request, *args, **kwargs):
        rzp_order_id = request.POST.get('razorpay_order_id')
        rzp_payment_id = request.POST.get('razorpay_payment_id')
        rzp_signature = request.POST.get('razorpay_signature')

        transaction = get_object_or_404(PremiumTransaction, rzp_order_id=rzp_order_id)

        client = razorpay.Client(auth=(config('RZP_CLIENT_ID'), config('RZP_CLIENT_SECRET')))

        try:
            client.utility.verify_payment_signature({
                'razorpay_order_id': rzp_order_id,
                'razorpay_payment_id': rzp_payment_id,
                'razorpay_signature': rzp_signature
            })

            # Mark as success
            transaction.rzp_payment_id = rzp_payment_id
            transaction.rzp_payment_signature = rzp_signature
            transaction.status = 'Success'
            transaction.paid_at = timezone.now()
            transaction.save()

            # Upgrade user
            request.user.profile.is_premium = True
            request.user.profile.premium_plan = transaction.plan
            request.user.profile.save()

            return redirect('dashboard')  # or show success page

        except razorpay.errors.SignatureVerificationError:
            transaction.status = 'Failed'
            transaction.save()
            return redirect('premium_failed')  # or show error page
