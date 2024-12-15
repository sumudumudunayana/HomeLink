#!/bin/sh

echo "STARTING SERVER"
python3 manage.py cmdqueue && 
python3 manage.py runserver 0.0.0.0:8000;