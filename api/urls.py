from django.conf.urls.defaults import *
from piston.resource import Resource
from handlers import *

calendar_handler = Resource(CalendarHandler)
task_handler = Resource(TaskHandler)

urlpatterns = patterns('',
    url(r'^calendar/(?P<post_slug>[^/]+)/', calendar_handler),
    url(r'^calendar/', calendar_handler),
    url(r'^task/(?P<post_slug>[^/]+)/', task_handler),
    url(r'^task/', task_handler),

)
