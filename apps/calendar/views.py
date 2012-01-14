import json

from django.http import HttpResponse

from models import Calendar, Task


def calendar_read(request):
  cid = int(request.GET['id'])
  return HttpResponse(json.dumps(Calendar.objects.get(id=cid).__dict__))


def task_create(request):
  assert request.method == 'POST'
  Task.objects.create(**request.POST)
  return HttpResponse()


def task_read(request):
  tid = int(request.GET['id'])
  return HttpResponse(json.dumps(Task.objects.get(id=tid).__dict__))


def task_update(request, id):
  assert request.method == 'POST'
  Task.objects.update(**request.POST)
  return HttpResponse()


def task_destroy(request, id):
  Task.objects.get(id=int(id)).delete()
  return HttpResponse()
