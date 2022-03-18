from rest_framework import serializers
from .models import Appointment, Account

class AccountSerializer(serializers.ModelSerializer):
	class Meta:
		model = Account
		fields = '__all__'

	def __str__(self):
		return str(self.first_name + " " + self.last_name)

class AppointmentSerializer(serializers.ModelSerializer):

	class Meta:
		model = Appointment
		fields = ('id','doctor', 'patient', 'date', 'timeslot','appType','description')

class AppointmentDisplaySerializer(serializers.ModelSerializer):
	doctor = serializers.SerializerMethodField()
	patient = serializers.SerializerMethodField()

	def get_doctor(self, obj):
		return 'Dr. {} {}'.format(obj.doctor.first_name, obj.doctor.last_name)

	def get_patient(self, obj):
		return '{} {}'.format(obj.patient.first_name, obj.patient.last_name)

	class Meta:
		model = Appointment
		fields = ('id','doctor', 'patient', 'date', 'timeslot','appType','description')
