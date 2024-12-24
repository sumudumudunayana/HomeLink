"use client";

import { useState, useEffect } from "react";

// Icons
import { DoorIcon, LightIcon, AlarmIcon, FanIcon } from "./Images";
// Control Settings
import { DevicePanel } from "./DevicePanel";

let webSocket: WebSocket;
webSocket = new WebSocket("ws://localhost:8000/ws/control/analytics");
setInterval(() => {
  if (webSocket.readyState !== webSocket.OPEN) {
    webSocket = new WebSocket("ws://localhost:8000/ws/control/analytics");
    return;
  }

  webSocket.send(`{"event":"health_check"}`);
}, 30000);

export default function Controller() {
  const [doorStatus, setDoorStatus] = useState<boolean>(false);
  const [doorAuto, setDoorAuto] = useState<boolean>(true);
  const [doorAdminSet, setDoorAdminSet] = useState<boolean>(false);

  const [lightStatus, setLightStatus] = useState<boolean>(false);
  const [lightAuto, setLightAuto] = useState<boolean>(true);
  const [lightAdminSet, setLightAdminSet] = useState<boolean>(false);

  const [shieldStatus, setShieldStatus] = useState<boolean>(false);

  const [alarmStatus, setAlarmStatus] = useState<boolean>(false);
  const [alarmAdminSet, setAlarmAdminSet] = useState<boolean>(false);

  const [fanStatus, setFanStatus] = useState<boolean>(false);
  const [fanAuto, setFanAuto] = useState<boolean>(true);
  const [fanAdminSet, setFanAdminSet] = useState<boolean>(false);

  const [selectedDevice, setSelectedDevice] = useState<string>("home");

  useEffect(() => {
    webSocket.onmessage = (event) => {
      if (event.data === "connection established") return;

      const { status } = JSON.parse(event.data);
      console.log(doorAdminSet);
      switch (status) {
        case "door_open":
          if (!doorAdminSet) {
            setDoorStatus(true);
          }
          break;
        case "door_closed":
          if (!doorAdminSet) {
            setDoorStatus(false);
          }
          break;
        case "light_on":
          if (!lightAdminSet) {
            setLightStatus(true);
          }
          break;
        case "light_off":
          if (!lightAdminSet) {
            setLightStatus(false);
          }
          break;
        case "alarm_on":
          if (!alarmAdminSet) {
            setAlarmStatus(true);
          }
          break;
        case "alarm_off":
          if (!alarmAdminSet) {
            setAlarmStatus(false);
          }
          break;
        case "fan_on":
          if (!fanAdminSet) {
            setFanStatus(true);
          }
          break;
        case "fan_off":
          if (!fanAdminSet) {
            setFanStatus(false);
          }
          break;
        default:
          break;
      }
    };
  }, [doorAdminSet, fanAdminSet, alarmAdminSet, lightAdminSet]);

  const getSettingsProps = () => {
    switch (selectedDevice) {
      case "door":
        return {
          device: "door",
          isAuto: doorAuto,
          isChecked: doorStatus,
          setIsChecked: setDoorStatus,
          setAuto: setDoorAuto,
          webSocket: webSocket,
          setDevice: setSelectedDevice,
          adminSet: setDoorAdminSet,
        };
      case "light":
        return {
          device: "light",
          isAuto: lightAuto,
          isChecked: lightStatus,
          setIsChecked: setLightStatus,
          setAuto: setLightAuto,
          webSocket: webSocket,
          setDevice: setSelectedDevice,
          adminSet: setLightAdminSet,
        };
      case "alarm":
        return {
          device: "alarm",
          isChecked: alarmStatus,
          setIsChecked: setAlarmStatus,
          webSocket: webSocket,
          setDevice: setSelectedDevice,
          adminSet: setAlarmAdminSet,
          shieldStatus: shieldStatus,
          setShieldStatus: setShieldStatus,
        };
      case "fan":
        return {
          device: "fan",
          isAuto: fanAuto,
          isChecked: fanStatus,
          setIsChecked: setFanStatus,
          setAuto: setFanAuto,
          webSocket: webSocket,
          setDevice: setSelectedDevice,
          adminSet: setFanAdminSet,
        };
      default:
        break;
    }
  };

  const renderButton = (
    device: string,
    Icon: React.FC,
    status: boolean,
    auto: boolean
  ) => (
    <button
      type="button"
      className="bg-slate-200 shadow-lg h-full rounded-md backdrop-blur-lg bg-white/12 transition duration-500 ease-in-out hover:scale-105 hover:bg-opacity-50 bg-opacity-20"
      onClick={() => setSelectedDevice(device)}
    >
      <Icon />
      <span
        className={`absolute top-0 right-0 w-3 h-3 m-4 rounded-full ${
          auto ? "bg-blue-500" : status ? "bg-green-500" : "bg-red-500"
        }`}
      ></span>
    </button>
  );

  return (
    <div className="row-span-2 grid grid-cols-2 gap-4 h-full">
      <DevicePanel {...getSettingsProps()} />
      <div className="grid grid-cols-2 gap-4 h-full">
        {renderButton("door", DoorIcon, doorStatus, doorAuto)}
        {renderButton("light", LightIcon, lightStatus, lightAuto)}
        {renderButton("alarm", AlarmIcon, alarmStatus, false)}
        {renderButton("fan", FanIcon, fanStatus, fanAuto)}
      </div>
    </div>
  );
}
