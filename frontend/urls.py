from django.urls import path
from django.contrib.auth.views import LogoutView
from . import views

urlpatterns = [
	path('', views.home.as_view(), name='home'),
    path('booking', views.booking, name='booking'),
	path('appointments', views.appointments, name='appointments'),
    path('login/', views.CustomLoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(next_page='login'), name='logout'),
    path('register/', views.Register, name='register'),
]

