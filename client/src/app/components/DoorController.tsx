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
  const [doorAuto, setDoorAuto] = useState<boolean>(true);

  useEffect(() => {
    webSocket.onmessage = (event) => {
      if (event.data === "connection established") return;
      let { status } = JSON.parse(event.data);
      console.log("STATUS: ", status);
      status == "door_open" ? setDoorStatus(true) : setDoorStatus(false);
    };
  }, []);

  const handleDoor = (command: string) => {
    webSocket.send(JSON.stringify({ cmd: command }));
    command == "door_open" ? setDoorStatus(true) : setDoorStatus(false);
  };
  const handleDoorManual = (command: string) => {
    webSocket.send(JSON.stringify({ cmd: command }));
    command == "door_open_manual" ? setDoorStatus(true) : setDoorStatus(false);
  };

  const handleDoorAuto = () => {
    const newDoorAuto = !doorAuto;
    console.log("NEW DOOR AUTO STATUS", newDoorAuto);
    if (newDoorAuto) {
      console.log("TURN ON AUTO");
      webSocket.send(JSON.stringify({ cmd: "door_operate_auto" }));
    } else {
      console.log("TURN OFF AUTO");
      handleDoorManual(doorStatus ? "door_open_manual" : "door_closed_manual");
    }
    setDoorAuto(newDoorAuto);
  };
  return (
    <div className="flex flex-col items-center gap-4">
      {doorStatus ? "DOOR IS OPEN" : "DOOR IS CLOSED"}
      <button
        className={`w-full py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white rounded-md ${
          doorStatus ? "bg-gray-300 text-gray-700" : ""
        }`}
        onClick={() =>
          handleDoorManual(
            doorStatus ? "door_closed_manual" : "door_open_manual"
          )
        }
      >
        {doorStatus ? "Close Door" : "Open Door"}
      </button>

      <button
        className={`w-full py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white rounded-md ${
          doorAuto ? "bg-gray-300 text-gray-700" : ""
        }`}
        onClick={() => handleDoorAuto()}
      >
        {doorAuto ? "Manual Mode" : "Auto Mode"}
      </button>
    </div>
  );
}
