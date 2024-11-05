"use client";
import { useState, useEffect } from "react";

let webSocket: WebSocket;
webSocket = new WebSocket("ws://localhost:8000/ws/door-status");
setInterval(() => {
  if (webSocket.readyState !== webSocket.OPEN) {
    webSocket = new WebSocket("ws://localhost:8000/ws/door-status");
    return;
  }

  webSocket.send(`{"event":"health_check"}`);
}, 30000);

export default function DoorController() {
  const [doorStatus, setDoorStatus] = useState<boolean>(false);

  useEffect(() => {
    webSocket.onmessage = (event) => {
      if (event.data === "connection established") return;

      let { status } = JSON.parse(event.data);
      status == "door_open" ? setDoorStatus(true) : setDoorStatus(false);
    };
  }, []);

  const handleDoor = (command: string) => {
    webSocket.send(JSON.stringify({ cmd: command }));
    command == "door_open" ? setDoorStatus(true) : setDoorStatus(false);
  };
  return (
    <div className="flex flex-col items-center gap-4">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          value=""
          className="sr-only peer"
          checked={doorStatus}
          onChange={() => handleDoor(doorStatus ? "door_closed" : "door_open")}
        />
        <div
          className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px]   
after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600   
peer-checked:after:bg-white peer-checked:after:border-blue-600"
        ></div>
        <span className="ml-3 text-lg font-medium text-gray-900 dark:text-gray-300">
          {doorStatus ? "Door is Open" : "Door is Closed"}
        </span>
      </label>
    </div>
  );
}
