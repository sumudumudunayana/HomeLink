"use client";
import { useState, useEffect } from "react";

let webSocket: WebSocket;
webSocket = new WebSocket("ws://localhost:8000/ws/control/analytics");
setInterval(() => {
  if (webSocket.readyState !== webSocket.OPEN) {
    webSocket = new WebSocket("ws://localhost:8000/ws/control/analytics");
    return;
  }

  webSocket.send(`{"event":"health_check"}`);
}, 30000);

export default function DeviceController() {
  const [doorStatus, setDoorStatus] = useState<boolean>(false);
  const [doorAuto, setDoorAuto] = useState<boolean>(true);
  const [lightStatus, setLightStatus] = useState<boolean>(false);
  const [lightAuto, setLightAuto] = useState<boolean>(true);
  const [alarmStatus, setAlarmStatus] = useState<boolean>(false);

  useEffect(() => {
    webSocket.onmessage = (event) => {
      if (event.data === "connection established") return;
      let { status } = JSON.parse(event.data);
      console.log("STATUS: ", status);
      if (status == "door_open") {
        setDoorStatus(true);
      }
      if (status == "door_closed") {
        setDoorStatus(false);
      }
      if (status == "light_on") {
        setLightStatus(true);
      }
      if (status == "light_off") {
        setLightStatus(false);
      }
    };
  }, []);

  const handleSetDoorStatus = (value: boolean) => {
    setDoorStatus(value);
  };
  const handleSetDoorAuto = (value: boolean) => {
    setDoorAuto(value);
  };

  const handleSetLightStatus = (value: boolean) => {
    setLightStatus(value);
  };
  const handleSetLightAuto = (value: boolean) => {
    setLightAuto(value);
  };
  const handleSetAlarmStatus = (value: boolean) => {
    setAlarmStatus(value);
  };

  return (
    <div>
      <DoorController
        handleSetDoorStatus={handleSetDoorStatus}
        doorStatus={doorStatus}
        handleSetDoorAuto={handleSetDoorAuto}
        doorAuto={doorAuto}
      />
      <br />
      <LightController
        handleSetLightStatus={handleSetLightStatus}
        lightStatus={lightStatus}
        handleSetLightAuto={handleSetLightAuto}
        lightAuto={lightAuto}
      />
      <br />
      <AlarmController
        handleSetAlarmStatus={handleSetAlarmStatus}
        alarmStatus={alarmStatus}
      />
    </div>
  );
}

function DoorController({
  handleSetDoorStatus,
  doorStatus,
  handleSetDoorAuto,
  doorAuto,
}) {
  const handleDoor = (command: string) => {
    webSocket.send(JSON.stringify({ cmd: command }));
    command == "door_open"
      ? handleSetDoorStatus(true)
      : handleSetDoorStatus(false);
  };
  const handleDoorManual = (command: string) => {
    webSocket.send(JSON.stringify({ cmd: command }));
    command == "door_open_manual"
      ? handleSetDoorStatus(true)
      : handleSetDoorStatus(false);
  };

  const handleDoorAuto = () => {
    const newDoorAuto = !doorAuto;
    if (newDoorAuto) {
      webSocket.send(JSON.stringify({ cmd: "door_operate_auto" }));
    } else {
      handleDoorManual(doorStatus ? "door_open_manual" : "door_closed_manual");
    }
    handleSetDoorAuto(newDoorAuto);
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

function LightController({
  handleSetLightStatus,
  lightStatus,
  handleSetLightAuto,
  lightAuto,
}) {
  const handleLight = (command: string) => {
    webSocket.send(JSON.stringify({ cmd: command }));
    command == "light_on"
      ? handleSetLightStatus(true)
      : handleSetLightStatus(false);
  };
  const handleLightManual = (command: string) => {
    webSocket.send(JSON.stringify({ cmd: command }));
    command == "light_on_manual"
      ? handleSetLightStatus(true)
      : handleSetLightStatus(false);
  };

  const handleLightAuto = () => {
    const newLightAuto = !lightAuto;
    if (newLightAuto) {
      webSocket.send(JSON.stringify({ cmd: "light_operate_auto" }));
    } else {
      handleLightManual(lightStatus ? "light_on_manual" : "light_off_manual");
    }
    handleSetLightAuto(newLightAuto);
  };
  return (
    <div className="flex flex-col items-center gap-4">
      {lightStatus ? "LIGHT IS ON" : "LIGHT IS OFF"}
      <button
        className={`w-full py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white rounded-md ${
          lightStatus ? "bg-gray-300 text-gray-700" : ""
        }`}
        onClick={() =>
          handleLightManual(
            lightStatus ? "light_off_manual" : "light_on_manual"
          )
        }
      >
        {lightStatus ? "Turn off Light" : "Turn on Light"}
      </button>

      <button
        className={`w-full py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white rounded-md ${
          lightAuto ? "bg-gray-300 text-gray-700" : ""
        }`}
        onClick={() => handleLightAuto()}
      >
        {lightAuto ? "Manual Mode" : "Auto Mode"}
      </button>
    </div>
  );
}

function AlarmController({ handleSetAlarmStatus, alarmStatus }) {
  const handleAlarmManual = (command: string) => {
    webSocket.send(JSON.stringify({ cmd: command }));
    command == "alarm_on"
      ? handleSetAlarmStatus(true)
      : handleSetAlarmStatus(false);
  };
  return (
    <div className="flex flex-col items-center gap-4">
      {alarmStatus ? "ALARM IS ON" : "ALARM IS OFF"}
      <button
        className={`w-full py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white rounded-md ${
          alarmStatus ? "bg-gray-300 text-gray-700" : ""
        }`}
        onClick={() =>
          handleAlarmManual(alarmStatus ? "alarm_off" : "alarm_on")
        }
      >
        {alarmStatus ? "Turn off Alarm" : "Turn on Alarm"}
      </button>
    </div>
  );
}
