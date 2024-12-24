#!/bin/sh

echo "STARTING SERVER"
python3 manage.py startbiometrics &
python3 manage.py startcmdexec &
python3 manage.py runserver 0.0.0.0:8000;