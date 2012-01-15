"""
RESTful API for the Task and Calendar models.

Resources can be accessed at:

http://127.0.0.1:8000/api/resource/?format=json
http://127.0.0.1:8000/api/resource/1/?format=json
http://127.0.0.1:8000/api/resource/schema/?format=json
http://127.0.0.1:8000/api/resource/set/1;3/?format=json
"""

from tastypie import fields
from tastypie.resources import ModelResource

from apps.calendar.models import Calendar, Task


class CalendarResource(ModelResource):
  tasks = fields.ToManyField('api.resources.TaskResource', 'task_set')
  class Meta:
    queryset = Calendar.objects.all()


class TaskResource(ModelResource):
  calendar = fields.ToOneField(CalendarResource, 'calendar')
  class Meta:
    queryset = Task.objects.all()
