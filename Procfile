web: bin/gunicorn_django --workers=4 --bind=0.0.0.0:$PORT PennApps2012s/settings.py
worker: bin/python PennApps2011s/manage.py celeryd -E -B --loglevel=INFO
