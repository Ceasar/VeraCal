from django.http import HttpResponse
from django.shortcuts import render_to_response

from helpers import json
from models import Calendar, Task


def calendar(request):
  assert request.method == "GET"
  return render_to_response('calendar.html')


@json
def calendar_read(request):
  assert request.method == "GET"
  if 'id' in request.GET:
    calendar = Calendar.objects.get(id=int(request.GET['id']))
    return calendar.to_json()
  else:
    calendars = Calendar.objects.all()
    return [calendar.to_json() for calendar in calendars]


def task_create(request):
  assert request.method == 'POST'
  Task.objects.create(**request.POST)
  return HttpResponse()


@json
def task_read(request):
  assert request.method == 'GET'
  if 'id' in request.GET:
    task = Task.objects.get(id=int(request.GET['id']))
    return task.to_json()
  else:
    tasks = Task.objects.all()
    return [task.to_json() for task in tasks]
    


def task_update(request):
  assert request.method == 'POST'
  Task.objects.update(**request.POST)
  return HttpResponse()


def task_destroy(request):
  assert request.method == 'POST'
  assert 'id' in request.POST
  Task.objects.get(id=int(request.POST['id'])).delete()
  return HttpResponse()
