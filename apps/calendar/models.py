import json

from django.contrib.auth.models import User
from django.db import models


class Calendar(models.Model):
  user = models.ForeignKey(User)


class Task(models.Model):
  calender = models.ForeignKey(Calendar)
  date = models.DateField()
  name = models.CharField(max_length=100)
  priority = models.IntegerField()

  def __unicode__(self):
    return self.name
