from django.shortcuts import render, redirect
from api.models import User
from django.urls import reverse_lazy
from django.views.generic.list import ListView


from django import forms
from django.forms import ModelForm
from api.models import Account
from .forms import CustomUserCreationForm, AccountForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView
from django.contrib.auth import login


class CustomLoginView(LoginView):
    template_name = 'login.html'
    fields = '__all__'
    redirect_authenticated_user = True

    def get_success_url(self):
        return reverse_lazy('home')

def Register(request):
    if request.method =='POST':
        form = CustomUserCreationForm(request.POST)
        account_form = AccountForm(request.POST)

        if form.is_valid() and account_form.is_valid():
            user = form.save()

            account = account_form.save(commit=False)
            account.user = user

            account.save()

            login(request, user)

            return redirect('home')
    else:
        form = CustomUserCreationForm()
        account_form = AccountForm()

    context = {'form' : form, 'account_form' : account_form}
    return render(request, 'register.html', context)

class home(ListView):
    model = Account
    context_object_name = 'doctors'
    template_name = 'index.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['doctors'] = context['doctors'].filter(is_doctor=True)
        context['count'] = context ['doctors'].count()
        return context


@login_required(login_url="/login/")
def booking(request):
    return render(request, 'booking.html')

@login_required(login_url="/login/")
def appointments(request):
	return render(request, 'appointments.html')
