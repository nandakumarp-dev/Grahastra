from django import forms
from .models import UserQuestion

class UserQuestionForm(forms.ModelForm):
    class Meta:
        model = UserQuestion
        fields = ['name', 'birth_date', 'birth_time', 'birth_place', 'question']
        widgets = {
            'birth_date': forms.DateInput(attrs={'type': 'date'}),
            'birth_time': forms.TimeInput(attrs={'type': 'time'}),
            'question': forms.Textarea(attrs={'rows': 4}),
        }
