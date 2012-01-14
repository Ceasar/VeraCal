from django.conf.urls.defaults import *

urlpatterns = patterns('apps.calendar.views',
  (r'^tasks', 'tasks'),
  )

urlpatterns += patterns('apps.calendar.views',
  (r'^calendars', 'calendars'), #json view
  (r'^calendar', 'calendar'),
  )

