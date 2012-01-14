from django.conf.urls.defaults import *

from tastypie.api import Api

from api.resources import TaskResource, CalendarResource

v1_api = Api(api_name='v1')
v1_api.register(CalendarResource)
v1_api.register(TaskResource())

urlpatterns = patterns('',
  (r'^calendar$', 'apps.calendar.views.calendar'),
  (r'^api/', include(v1_api.urls)),
  )
