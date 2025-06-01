from django.shortcuts import render
from .forms import UserQuestionForm

# Create your views here.

def landing_page(request):
    if request.method == 'POST':
        form = UserQuestionForm(request.POST)
        if form.is_valid():
            form.save()
            return render(request, 'thank_you.html', {'name': form.cleaned_data['name']})
    else:
        form = UserQuestionForm()
    return render(request, 'landing.html', {'form': form})
