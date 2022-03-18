from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.http import JsonResponse
from django.views.generic.edit import CreateView
import datetime

from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import AppointmentDisplaySerializer, AppointmentSerializer, AccountSerializer

from .models import Appointment, Account

@api_view(['GET'])
def apiOverview(request):
	api_urls = {
		'List' : '/appointment-list/',
		'Create' : '/appointment-create/',
		'Update' : '/appointment-edit/<int:pk>/',
		'Delete' : '/appointment-cancel/<int:pk>/',
	}
	return Response(api_urls)

class appointmentList(APIView):
	context_object_name = 'appointments'

	def get(self, request, **kwargs):
		if (self.request.user.profile_user.is_patient):
			appointments = Appointment.objects.filter(patient=self.request.user.profile_user)
		else:
			appointments = Appointment.objects.filter(doctor=self.request.user.profile_user)
		
		serializer = AppointmentSerializer(appointments, many=True)
		return Response(serializer.data)

class appointmentListPast(APIView):
	context_object_name = 'appointments'

	def get(self, request, **kwargs):
		if (self.request.user.profile_user.is_patient):
			appointments = Appointment.objects.filter(patient=self.request.user.profile_user, date__lt = datetime.date.today())
		else:
			appointments = Appointment.objects.filter(doctor=self.request.user.profile_user, date__lt = datetime.date.today())
		
		serializer = AppointmentDisplaySerializer(appointments, many=True)
		return Response(serializer.data)

class appointmentListFuture(APIView):
	context_object_name = 'appointments'

	def get(self, request, **kwargs):
		if (self.request.user.profile_user.is_patient):
			appointments = Appointment.objects.filter(patient=self.request.user.profile_user, date__gte = datetime.date.today())
		else:
			appointments = Appointment.objects.filter(doctor=self.request.user.profile_user, date__gte = datetime.date.today())
		
		serializer = AppointmentDisplaySerializer(appointments, many=True)
		return Response(serializer.data)

@api_view(['GET'])
def allAppointments(request):
	appointments = Appointment.objects.all()

	serializer = AppointmentSerializer(appointments, many=True)
	return Response(serializer.data)

@api_view(['POST'])
def appointmentCreate(request):
	serializer = AppointmentSerializer(data=request.data)

	if serializer.is_valid():
		serializer.save()
	return Response(serializer.data)

@api_view(['DELETE'])
def appointmentDelete(request, pk):
	
	appointment = Appointment.objects.get(id=pk)
	appointment.delete()
	return Response("Appointment was cancelled")

@api_view(['GET'])
def accountList(request):
	accounts = Account.objects.all()
	serializer = AccountSerializer(accounts, many=True)
	return Response(serializer.data)

