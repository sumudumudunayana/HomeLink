#!/bin/sh

check_services() {
    echo "Checking if beacon, controller, and Redis server are running..."
    read -p "Are the beacon and controller initialized correctly? (y/n): " response

    if [ "$response" != "y" ]; then
        echo "Beacon or controller is not running. Please start them first."
        return 1
    fi

    read -p "Is the Redis server running? (y/n): " redis_response

    if [ "$redis_response" != "y" ]; then
        echo "Redis server is not running. Please start it first."
        return 1
    fi

    echo "All required services are running."
    return 0
}

start_server() {
    echo "STARTING SERVER"
    python manage.py startbiometrics &
    python manage.py startcmdexec &
    python manage.py startgaia &
    python manage.py runserver 0.0.0.0:8000
}

start_client() {
    echo "STARTING CLIENT"
    cd ../client
    npm run dev &
    cd -
}

if check_services; then
    start_client
    start_server
else
    echo "Cannot start server and client. Please ensure all services are running."
fi