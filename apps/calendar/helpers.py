from json import dumps

from django.http import HttpResponse


def json(func):
  def dump(*args, **kwargs):
    return HttpResponse(dumps(func(*args, **kwargs)))
  return dump
