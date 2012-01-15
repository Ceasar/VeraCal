"""
RESTful API for the Task and Calendar models.

Resources can be accessed at:

http://127.0.0.1:8000/api/resource/?format=json
http://127.0.0.1:8000/api/resource/1/?format=json
http://127.0.0.1:8000/api/resource/schema/?format=json
http://127.0.0.1:8000/api/resource/set/1;3/?format=json
"""

from tastypie import fields
from tastypie.resources import ModelResource, ALL, ALL_WITH_RELATIONS
from tastypie.authorization import Authorization

from apps.calendar.models import Calendar, Task
from tastypie.authorization import Authorization


class CalendarResource(ModelResource):
  tasks = fields.ToManyField('apps.calendar.api.resources.TaskResource', 'tasks')
  class Meta:
    queryset = Calendar.objects.all()
    filtering = {
        'id': ALL
        }


class TaskResource(ModelResource):
  calendar = fields.ToOneField(CalendarResource, 'calendar')
  class Meta:
    queryset = Task.objects.all()
    filtering = {
        'calendar': ALL_WITH_RELATIONS,
        'date': ALL
        }
    allowed_methods = ['get', 'post', 'put', 'delete']
    authorization = Authorization()

  def dehydrate(self, bundle):
    bundle.data['cid'] = bundle.obj.calendar.id
    return bundle
