import json

from django.http import HttpResponse
from django.shortcuts import render_to_response

from models import Calendar, Task


def calendar(request):
  assert request.method == "GET"
  return render_to_response('calendar.html')


def calendar_read(request):
  assert request.method == "GET"
  assert 'id' in request.GET
  calendar = Calendar.objects.get(id=int(request.GET['id']))
  return HttpResponse(json.dumps(calendar.to_json()))


def task_create(request):
  assert request.method == 'POST'
  Task.objects.create(**request.POST)
  return HttpResponse()


def task_read(request):
  assert request.method == 'GET'
  assert 'id' in request.GET
  task = Task.objects.get(id=int(request.GET['id']))
  return HttpResponse(json.dumps(task.to_json()))


def task_update(request):
  assert request.method == 'POST'
  Task.objects.update(**request.POST)
  return HttpResponse()


def task_destroy(request):
  assert request.method == 'POST'
  assert 'id' in request.POST
  Task.objects.get(id=int(request.POST['id'])).delete()
  return HttpResponse()
