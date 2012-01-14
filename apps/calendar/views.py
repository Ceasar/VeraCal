from django.http import HttpResponse
from django.shortcuts import render_to_response

from helpers import json
from models import Calendar, Task


def calendar(request):
  assert request.method == "GET"
  return render_to_response('calendar.html')


@json
def calendars(request):
  assert request.method == "GET"
  if request.method == "GET":
    if 'id' in request.GET:
      calendar = Calendar.objects.get(id=int(request.GET['id']))
      return calendar.to_json()
    else:
      calendars = Calendar.objects.all()
      return [calendar.to_json() for calendar in calendars]

@json
def tasks(request):
  if request.method == "POST":
    return Task.objects.create(**request.POST)
  elif request.method == "GET":
    if 'id' in request.GET:
      task = Task.objects.get(id=int(request.GET['id']))
      return task.to_json()
    else:
      tasks = Task.objects.all()
      return [task.to_json() for task in tasks]
  elif request.method == "PUT":
    return Task.objects.update(**request.POST)
  elif request.method == "DESTROY":
    Task.objects.get(id=int(request.POST['id'])).delete()
    return True
