"""
RESTful API for the Task and Calendar models.

Resources can be accessed at:

http://127.0.0.1:8000/api/resource/?format=json
http://127.0.0.1:8000/api/resource/1/?format=json
http://127.0.0.1:8000/api/resource/schema/?format=json
http://127.0.0.1:8000/api/resource/set/1;3/?format=json
"""

from tastypie.resources import ModelResource
from models import Calendar, Task
from tastypie import fields
from django.contrib.auth.models import User

class TaskResource(ModelResource):
  class Meta:
    queryset = Task.objects.all()
    resource_name = 'tasks'
    authorization = Authorization()

class CalendarResource(ModelResource):
  class Meta:
    queryset = Calendar.objects.all()
    resource_name = 'calendars'
    authorization = Authorization()

class UserResource(ModelResource):
    class Meta:
        queryset = User.objects.all()
        resource_name = 'user'


