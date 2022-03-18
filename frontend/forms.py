from django import forms
from django.forms import ModelForm
from api.models import User, Account
from django.contrib.auth.forms import UserCreationForm

class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = User
        fields = ('email','password1', 'password2')

class AccountForm(forms.ModelForm):
    class Meta:
        model = Account
        fields = ('first_name', 'last_name','dob','address_line_1','address_line_2','postcode', 'phone')
