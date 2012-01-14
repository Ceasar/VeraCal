from tastypie.resources import ModelResource
from models import Calendar, Task


class TaskResource(ModelResource):
  class Meta:
    queryset = Task.objects.all()
    resource_name = 'tasks'

class CalendarResource(ModelResource):
  class Meta:
    queryset = Calendar.objects.all()
    resource_name = 'calendars'
