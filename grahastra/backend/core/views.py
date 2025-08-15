from django.shortcuts import render
from django.views import View


class Landing_Home(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'landing_home.html')
