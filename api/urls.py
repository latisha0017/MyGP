from django.urls import path
from . import views

app_name="api"
urlpatterns = [
	path('', views.apiOverview, name='api'),
	path('appointment-list/', views.appointmentList.as_view(), name='appointment-list'),
	path('appointment-list-past/', views.appointmentListPast.as_view(), name='appointment-past'),
	path('appointment-list-future/', views.appointmentListFuture.as_view(), name='appointment-future'),
	path('all-appointments/', views.allAppointments, name='all-appointments'),
	path('appointment-create/', views.appointmentCreate, name='appointment-create'),
	path('appointment-cancel/<int:pk>/', views.appointmentDelete, name='appointment-cancel'),	
	path('account-list/', views.accountList, name='account-list'),
]