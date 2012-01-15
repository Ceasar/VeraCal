from django.http import HttpResponse
from django.shortcuts import render_to_response

from models import Calendar, Task


def calendar(request):
  assert request.method == "GET"
  return render_to_response('calendar.html')
