from django.shortcuts import render


def index(request):
    return render(request, "analytics/index.html")


def room(request, room_name):
    return render(request, "analytics/room.html", {"room_name": room_name})
