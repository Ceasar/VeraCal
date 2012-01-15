from django.contrib.auth.models import User
from django.db import models


class Calendar(models.Model):
  user = models.ForeignKey(User)

  def to_json(self):
    d = dict(self.__dict__)
    del d['_state']
    d['tasks'] = [task.to_json() for task in self.task_set.all()]
    return d
  
  def __unicode__(self):
    return "Personal"


class Task(models.Model):
  calendar = models.ForeignKey(Calendar)
  date = models.DateField()
  name = models.CharField(max_length=100)
  priority = models.IntegerField()

  def __unicode__(self):
    return self.name

  def to_json(self):
    d = dict(self.__dict__)
    del d['_state']
    d['date'] = str(d['date'])
    return d
