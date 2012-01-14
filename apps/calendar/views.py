import json

from django.http import HttpResponse

from models import Calendar, Task


def calendar_read(request):
  assert request.method == "GET"
  assert 'id' in request.GET
  calendar = Calendar.objects.get(id=int(request.GET['id']))
  # django adds a _state key to objects so we need to copy and delete it first
  cal_dict = dict(calendar.__dict__)
  del cal_dict['_state']
  return HttpResponse(json.dumps(cal_dict))


def task_create(request):
  assert request.method == 'POST'
  Task.objects.create(**request.POST)
  return HttpResponse()


def task_read(request):
  assert request.method == 'GET'
  assert 'id' in request.GET
  task = Task.objects.get(id=int(request.GET['id']))
  # django adds a _state key to objects so we need to copy and delete it first
  task_dict = dict(task.__dict__)
  del task_dict['_state']
  # additionally, datetime isn't serializble, so we need to make it a string
  task_dict['date'] = str(task_dict['date'])
  return HttpResponse(json.dumps(task_dict))


def task_update(request):
  assert request.method == 'POST'
  Task.objects.update(**request.POST)
  return HttpResponse()


def task_destroy(request):
  assert request.method == 'POST'
  tid = request.POST['id']
  Task.objects.get(id=int(id)).delete()
  return HttpResponse()
