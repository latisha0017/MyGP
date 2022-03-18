from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
    """Define a model manager for User model with no username field."""

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular User with the given email and password."""
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)

class User(AbstractUser):
    username = None
    email = models.EmailField(_('email address'), unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

class Account(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile_user')
	first_name = models.CharField(max_length=50, default='')
	last_name =  models.CharField(max_length=50, default='')
	dob = models.DateField()
	address_line_1 = models.CharField(max_length=50)
	address_line_2 = models.CharField(max_length=50)
	postcode = models.CharField(max_length=50)
	phone = models.BigIntegerField()
	is_patient = models.BooleanField(default=True)
	is_doctor = models.BooleanField(default=False)

	def __str__(self):
		return str(self.user.email)

	@property
	def full_name(self):
		full_name = self.last_name + ", " + self.first_name 
		return full_name


class Appointment(models.Model):
	class Meta:
		unique_together = ('doctor', 'date', 'timeslot')
		ordering = ['date','timeslot']
	
	TIMESLOTS = (
		('09:00 – 09:30', '09:00 – 09:30'),
        ('10:00 – 10:30', '10:00 – 10:30'),
        ('11:00 – 11:30', '11:00 – 11:30'),
        ('12:00 – 12:30', '12:00 – 12:30'),
        ('13:00 – 13:30', '13:00 – 13:30'),
        ('15:00 – 15:30', '15:00 – 15:30'),
        ('16:00 – 16:30', '16:00 – 16:30'),
        ('17:00 – 17:30', '17:00 – 17:30'),
    )
	TYPES = (
    		('Face-To-Face', 'Face-To-Face'),
    		('Phone Consultation', 'Phone Consultation')
    	)
	doctor = models.ForeignKey(Account, on_delete=models.CASCADE, limit_choices_to={'is_doctor': True}, related_name='doc')
	patient = models.ForeignKey(Account, on_delete=models.CASCADE, limit_choices_to={'is_patient': True}, related_name='pat')
	date = models.DateField()
	timeslot = models.CharField(max_length=20, choices=TIMESLOTS)
	appType = models.CharField(max_length=20, choices= TYPES)
	description = models.CharField(max_length=300, null=False, blank=False)

	def __str__(self):
		return '{} {} Dr. {}, Patient: {}'.format(self.date, self.timeslot, self.doctor, self.patient, self.appType)




