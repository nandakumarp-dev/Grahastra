from django.db import models

# Create your models here.

from django.views.generic.edit import UpdateView
from django.contrib.auth.mixins import LoginRequiredMixin
from authentication.models import Profile
from django.urls import reverse_lazy

class ProfileUpdateView(LoginRequiredMixin, UpdateView):
    model = Profile
    fields = ['language', 'phone', 'occupation', 'marital_status', 'profile_photo']
    template_name = 'authentication/edit_profile_page.html'
    success_url = reverse_lazy('profile')  # Create a simple profile display page

    def get_object(self):
        return self.request.user.profile