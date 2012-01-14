from django.conf.urls.defaults import *
from api import TaskResource, CalendarResource

calendar_resource = CalendarResource()
task_resource = TaskResource()

urlpatterns = patterns('',
  (r'^calendar$', 'apps.calendar.views.calendar'),
  (r'^api/', include(task_resource.urls)),
  (r'^api/', include(calendar_resource.urls)),
  )
