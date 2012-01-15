from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext

from forms import TaskForm
from models import Calendar, Task


def calendar(request):
  if request.method == 'POST':
    c = Calendar.objects.all()[0]
    form = TaskForm(request.POST, Task())
    if form.is_valid():
      form.save()
      # create a new empty form
      form = TaskForm()
  else:
    form = TaskForm()
  return render_to_response('calendar.html', RequestContext(request,
    {'form': form}))
