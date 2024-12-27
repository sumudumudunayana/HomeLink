#!/bin/sh

echo "STARTING SERVER"
python manage.py startbiometrics &
python manage.py startcmdexec &
python manage.py startgaia &
python manage.py runserver 0.0.0.0:8000;