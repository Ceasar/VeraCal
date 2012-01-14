from django.conf.urls.defaults import *

urlpatterns = patterns('apps.calendar.views',
  (r'^tasks/update', 'task_update'),
  (r'^tasks/destroy', 'task_destroy'),
  (r'^tasks/create', 'task_create'),
  (r'^tasks', 'task_read'),
  )

urlpatterns += patterns('apps.calendar.views',
  (r'^calendars', 'calendar_read'), #json view
  (r'^calendar', 'calendar'),
  )

