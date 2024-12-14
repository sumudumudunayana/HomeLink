"use client";
import { useState, useEffect } from "react";

// Icons
import { HomeIcon, DoorIcon } from "./Images";
import { Switch } from "./Util";

import WeatherReport from "./Weather";

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
  const [fanStatus, setFanStatus] = useState<boolean>(false);
  const [fanAuto, setFanAuto] = useState<boolean>(true);
  const [selectedDevice, setSelectedDevice] = useState<string>("home");

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

  const getSettingsProps = () => {
    if (selectedDevice == "door") {
      return {
        device: "door",
        isAuto: doorAuto,
        isChecked: doorStatus,
        setIsChecked: setDoorStatus,
        setAuto: setDoorAuto,
      };
    }
    if (selectedDevice == "light") {
      return {
        device: "light",
        isAuto: lightAuto,
        isChecked: lightStatus,
        setIsChecked: setLightStatus,
        setAuto: setLightAuto,
      };
    }
    if (selectedDevice == "alarm") {
      return {
        device: "alarm",
        isChecked: alarmStatus,
        setIsChecked: setAlarmStatus,
      };
    }
    if (selectedDevice == "fan") {
      return {
        device: "fan",
        isAuto: fanAuto,
        isChecked: fanStatus,
        setIsChecked: setFanStatus,
        setAuto: setFanAuto,
      };
    }
  };

  return (
    <div className="grid grid-rows-3 grid-flow-col h-full gap-4 w-5/6 mx-auto pb-5">
      <div className="row-span-2 grid grid-cols-2 gap-4 h-full">
        <Settings {...getSettingsProps()} />
        <div className="grid grid-cols-2 gap-4 h-full">
          <button
            type="button"
            className="relative bg-slate-200  shadow-lg  h-full rounded-md backdrop-blur-lg bg-white/12  transition duration-500 ease-in-out hover:scale-105 hover:bg-opacity-50 bg-opacity-20"
            onClick={() => setSelectedDevice("door")}
          >
            <DoorIcon />
            <span
              className={
                doorAuto
                  ? "absolute top-0 right-0 w-3 h-3 m-4 bg-blue-500 rounded-full"
                  : doorStatus
                  ? "absolute top-0 right-0 w-3 h-3 m-4 bg-green-500 rounded-full"
                  : "absolute top-0 right-0 w-3 h-3 m-4 bg-red-500 rounded-full"
              }
            ></span>
          </button>
          <button
            type="button"
            className="bg-slate-200 shadow-lg  h-full rounded-md backdrop-blur-lg bg-white/12  transition duration-500 ease-in-out hover:scale-105 hover:bg-opacity-50 bg-opacity-20"
            onClick={() => setSelectedDevice("light")}
          >
            <svg
              className="w-20 h-20 mx-auto"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.5 2C7.35786 2 4 5.43595 4 9.67442C4 11.9468 4.96602 13.9892 6.49859 15.3934C7.0094 15.8614 7.38782 16.2082 7.65601 16.4598C7.7901 16.5855 7.89262 16.6838 7.9683 16.7592C8.00601 16.7968 8.03486 16.8266 8.05635 16.8496C8.06699 16.861 8.07499 16.8699 8.0808 16.8766C8.08649 16.8831 8.0892 16.8864 8.0892 16.8864C8.32571 17.1851 8.3769 17.2622 8.40739 17.332C8.43787 17.4018 8.45982 17.4922 8.51949 17.8717C8.54305 18.0216 8.54545 18.2782 8.54545 18.9767L8.54545 19.0067C8.54544 19.4158 8.54543 19.7687 8.57107 20.0583C8.5982 20.3645 8.65825 20.6677 8.81949 20.9535C8.99902 21.2717 9.25723 21.5359 9.56818 21.7196C9.84747 21.8846 10.1438 21.946 10.443 21.9738C10.726 22 11.0709 22 11.4707 22H11.5293C11.9291 22 12.274 22 12.557 21.9738C12.8562 21.946 13.1525 21.8846 13.4318 21.7196C13.7428 21.5359 14.001 21.2717 14.1805 20.9535C14.3418 20.6677 14.4018 20.3645 14.4289 20.0583C14.4546 19.7687 14.4546 19.4158 14.4545 19.0067V18.9767C14.4545 18.2782 14.457 18.0216 14.4805 17.8717C14.5402 17.4922 14.5621 17.4018 14.5926 17.332C14.6231 17.2622 14.6743 17.1851 14.9108 16.8864C14.9108 16.8864 14.9133 16.8834 14.9192 16.8766C14.925 16.8699 14.933 16.861 14.9436 16.8496C14.9651 16.8266 14.994 16.7968 15.0317 16.7592C15.1074 16.6838 15.2099 16.5855 15.344 16.4598C15.6122 16.2082 15.9906 15.8614 16.5014 15.3934C18.034 13.9892 19 11.9468 19 9.67442C19 5.43595 15.6421 2 11.5 2ZM13.0851 19.6744H9.91494C9.91791 19.7714 9.92239 19.8561 9.92914 19.9323C9.94769 20.1418 9.97899 20.2178 10.0004 20.2558C10.0603 20.3619 10.1463 20.4499 10.25 20.5112C10.2871 20.5331 10.3615 20.5651 10.5661 20.5841C10.7802 20.604 11.0626 20.6047 11.5 20.6047C11.9374 20.6047 12.2198 20.604 12.4339 20.5841C12.6385 20.5651 12.7129 20.5331 12.75 20.5112C12.8537 20.4499 12.9397 20.3619 12.9996 20.2558C13.021 20.2178 13.0523 20.1418 13.0709 19.9323C13.0776 19.8561 13.0821 19.7714 13.0851 19.6744ZM12.6105 8.17647C12.9169 8.40043 12.9878 8.83616 12.769 9.1497L11.591 10.8372H12.9934C13.2488 10.8372 13.4828 10.9833 13.5996 11.2156C13.7165 11.448 13.6966 11.7277 13.5482 11.9404L11.6001 14.7311C11.3813 15.0446 10.9554 15.1173 10.649 14.8933C10.3426 14.6693 10.2716 14.2336 10.4905 13.9201L11.6685 12.2326H10.2661C10.0107 12.2326 9.77673 12.0865 9.65986 11.8541C9.54299 11.6218 9.56284 11.342 9.71129 11.1294L11.6593 8.33867C11.8782 8.02513 12.304 7.95251 12.6105 8.17647Z"
                fill="#fff"
              />
            </svg>
            <span
              className={
                lightAuto
                  ? "absolute top-0 right-0 w-3 h-3 m-4 bg-blue-500 rounded-full"
                  : lightStatus
                  ? "absolute top-0 right-0 w-3 h-3 m-4 bg-green-500 rounded-full"
                  : "absolute top-0 right-0 w-3 h-3 m-4 bg-red-500 rounded-full"
              }
            ></span>
          </button>
          <button
            type="button"
            className="bg-slate-200 shadow-lg  h-full rounded-md backdrop-blur-lg bg-white/12  transition duration-500 ease-in-out hover:scale-105 hover:bg-opacity-50 bg-opacity-20"
            onClick={() => setSelectedDevice("alarm")}
          >
            <svg
              className="w-20 h-20 mx-auto"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>eye_2_fill</title>
              <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g
                  id="Part"
                  transform="translate(-144.000000, -48.000000)"
                  fillRule="nonzero"
                >
                  <g
                    id="eye_2_fill"
                    transform="translate(144.000000, 48.000000)"
                  >
                    <path
                      d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z"
                      fillRule="nonzero"
                    ></path>
                    <path
                      d="M12,5 C15.6786,5 20.1621,7.41663 21.7292,10.9014 C21.8765,11.229 22,11.6119 22,12 C22,12.3881 21.8765,12.771 21.7292,13.0986 C20.1621,16.5834 15.6786,19 12,19 C8.32138,19 3.83788,16.5834 2.27082,13.0986 C2.12348,12.771 2,12.3881 2,12 C2,11.6119 2.12348,11.229 2.27082,10.9014 C3.83789,7.41663 8.32138,5 12,5 Z M12,8 C9.79086,8 8,9.79086 8,12 C8,14.2091 9.79086,16 12,16 C14.2091,16 16,14.2091 16,12 C16,9.79086 14.2091,8 12,8 Z M12,10 C13.1046,10 14,10.8954 14,12 C14,13.1046 13.1046,14 12,14 C10.8954,14 10,13.1046 10,12 C10,10.8954 10.8954,10 12,10 Z"
                      fill="#fff"
                    ></path>
                  </g>
                </g>
              </g>
            </svg>
            <span
              className={
                alarmStatus
                  ? "absolute top-0 right-0 w-3 h-3 m-4 bg-green-500 rounded-full"
                  : "absolute top-0 right-0 w-3 h-3 m-4 bg-red-500 rounded-full"
              }
            ></span>
          </button>
          <button
            type="button"
            className="bg-slate-200 shadow-lg  h-full rounded-md backdrop-blur-lg bg-white/12  transition duration-500 ease-in-out hover:scale-105 hover:bg-opacity-50 bg-opacity-20"
            onClick={() => setSelectedDevice("fan")}
          >
            <svg
              fill="#fff"
              className="w-20 h-20 mx-auto"
              width="800px"
              height="800px"
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M352.57 128c-28.09 0-54.09 4.52-77.06 12.86l12.41-123.11C289 7.31 279.81-1.18 269.33.13 189.63 10.13 128 77.64 128 159.43c0 28.09 4.52 54.09 12.86 77.06L17.75 224.08C7.31 223-1.18 232.19.13 242.67c10 79.7 77.51 141.33 159.3 141.33 28.09 0 54.09-4.52 77.06-12.86l-12.41 123.11c-1.05 10.43 8.11 18.93 18.59 17.62 79.7-10 141.33-77.51 141.33-159.3 0-28.09-4.52-54.09-12.86-77.06l123.11 12.41c10.44 1.05 18.93-8.11 17.62-18.59-10-79.7-77.51-141.33-159.3-141.33zM256 288a32 32 0 1 1 32-32 32 32 0 0 1-32 32z" />
            </svg>
            <span
              className={
                fanAuto
                  ? "absolute top-0 right-0 w-3 h-3 m-4 bg-blue-500 rounded-full"
                  : fanStatus
                  ? "absolute top-0 right-0 w-3 h-3 m-4 bg-green-500 rounded-full"
                  : "absolute top-0 right-0 w-3 h-3 m-4 bg-red-500 rounded-full"
              }
            ></span>
          </button>
        </div>
      </div>
      <WeatherReport />
    </div>
  );
}

const Settings = ({ device, isChecked, setIsChecked, isAuto, setAuto }) => {
  const handleDoor = (command: string) => {
    webSocket.send(JSON.stringify({ cmd: command }));
    command == "door_open" ? setIsChecked(true) : setIsChecked(false);
  };
  const handleDoorManual = (command: string) => {
    webSocket.send(JSON.stringify({ cmd: command }));
    command == "door_open_manual" ? setIsChecked(true) : setIsChecked(false);
  };
  const handleDoorAuto = () => {
    const newDoorAuto = !isAuto;
    if (newDoorAuto) {
      webSocket.send(JSON.stringify({ cmd: "door_operate_auto" }));
    } else {
      handleDoorManual(isChecked ? "door_open_manual" : "door_closed_manual");
    }
    setAuto(newDoorAuto);
  };
  const handleLight = (command: string) => {
    webSocket.send(JSON.stringify({ cmd: command }));
    command == "light_on" ? setIsChecked(true) : setIsChecked(false);
  };
  const handleLightManual = (command: string) => {
    webSocket.send(JSON.stringify({ cmd: command }));
    command == "light_on_manual" ? setIsChecked(true) : setIsChecked(false);
  };
  const handleLightAuto = () => {
    const newLightAuto = !isAuto;
    if (newLightAuto) {
      webSocket.send(JSON.stringify({ cmd: "light_operate_auto" }));
    } else {
      handleLightManual(isChecked ? "light_on_manual" : "light_off_manual");
    }
    setAuto(newLightAuto);
  };
  const handleAlarmManual = (command: string) => {
    webSocket.send(JSON.stringify({ cmd: command }));
    command == "alarm_on" ? setIsChecked(true) : setIsChecked(false);
  };
  const handleFan = (command: string) => {
    webSocket.send(JSON.stringify({ cmd: command }));
    command == "fan_on" ? setIsChecked(true) : setIsChecked(false);
  };
  const handleFanManual = (command: string) => {
    webSocket.send(JSON.stringify({ cmd: command }));
    command == "fan_on_manual" ? setIsChecked(true) : setIsChecked(false);
  };

  const handleFanAuto = () => {
    const newFanAuto = !isAuto;
    if (newFanAuto) {
      webSocket.send(JSON.stringify({ cmd: "fan_operate_auto" }));
    } else {
      handleFanManual(isChecked ? "fan_on_manual" : "fan_off_manual");
    }
    setAuto(newFanAuto);
  };
  if (device == "door") {
    return (
      <div className="grid grid-flow-col grid-rows-4 bg-slate-900 bg-opacity-10 shadow-lg  h-full rounded-md backdrop-blur-lg bg-white/12">
        <span className="grid grid-flow-row grid-cols-4 w-full">
          <h2 className="m-8 col-span-3 text-5xl font-bold text-lime-200 rounded-lg">
            SmartBin
          </h2>
          <span className="align-end m-8">
            <span className="w-5 h-5">
              <svg
                className="w-12 h-12 mx-auto"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.5 3H16C15.7239 3 15.5 3.22386 15.5 3.5V3.55891L19 6.35891V3.5C19 3.22386 18.7762 3 18.5 3Z"
                  fill="#fff"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.75 9.5C10.75 8.80964 11.3097 8.25 12 8.25C12.6904 8.25 13.25 8.80964 13.25 9.5C13.25 10.1904 12.6904 10.75 12 10.75C11.3097 10.75 10.75 10.1904 10.75 9.5Z"
                  fill="#fff"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M20.75 10.9605L21.5315 11.5857C21.855 11.8444 22.3269 11.792 22.5857 11.4685C22.8444 11.1451 22.792 10.6731 22.4685 10.4143L14.3426 3.91362C12.9731 2.81796 11.027 2.81796 9.65742 3.91362L1.53151 10.4143C1.20806 10.6731 1.15562 11.1451 1.41438 11.4685C1.67313 11.792 2.1451 11.8444 2.46855 11.5857L3.25003 10.9605V21.25H2.00003C1.58581 21.25 1.25003 21.5858 1.25003 22C1.25003 22.4142 1.58581 22.75 2.00003 22.75H22C22.4142 22.75 22.75 22.4142 22.75 22C22.75 21.5858 22.4142 21.25 22 21.25H20.75V10.9605ZM9.25003 9.5C9.25003 7.98122 10.4812 6.75 12 6.75C13.5188 6.75 14.75 7.98122 14.75 9.5C14.75 11.0188 13.5188 12.25 12 12.25C10.4812 12.25 9.25003 11.0188 9.25003 9.5ZM12.0494 13.25C12.7143 13.25 13.2871 13.2499 13.7459 13.3116C14.2375 13.3777 14.7088 13.5268 15.091 13.909C15.4733 14.2913 15.6223 14.7625 15.6884 15.2542C15.7462 15.6842 15.7498 16.2146 15.75 16.827C15.75 16.8679 15.75 16.9091 15.75 16.9506L15.75 21.25H14.25V17C14.25 16.2717 14.2484 15.8009 14.2018 15.454C14.1581 15.1287 14.0875 15.0268 14.0304 14.9697C13.9733 14.9126 13.8713 14.842 13.546 14.7982C13.1991 14.7516 12.7283 14.75 12 14.75C11.2717 14.75 10.8009 14.7516 10.4541 14.7982C10.1288 14.842 10.0268 14.9126 9.9697 14.9697C9.9126 15.0268 9.84199 15.1287 9.79826 15.454C9.75162 15.8009 9.75003 16.2717 9.75003 17V21.25H8.25003L8.25003 16.9506C8.24999 16.2858 8.24996 15.7129 8.31163 15.2542C8.37773 14.7625 8.52679 14.2913 8.90904 13.909C9.29128 13.5268 9.76255 13.3777 10.2542 13.3116C10.7129 13.2499 11.2858 13.25 11.9507 13.25H12.0494Z"
                  fill="#fff"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.75 9.5C10.75 8.80964 11.3097 8.25 12 8.25C12.6904 8.25 13.25 8.80964 13.25 9.5C13.25 10.1904 12.6904 10.75 12 10.75C11.3097 10.75 10.75 10.1904 10.75 9.5Z"
                  fill="#fff"
                />
              </svg>
            </span>
          </span>
        </span>
        <span className="row-span-3 m-8 text-start">
          <h2 className="text-2xl font-bold text-white rounded-lg">
            Introducing the Smart Dustbin: A Hands-Free Hygiene Solution
          </h2>
          <br />
          <p>
            Our Smart Dustbin is a hygienic and convenient solution for waste
            disposal. Equipped with advanced motion sensors, it automatically
            opens its lid when it detects a hand approaching. No need to touch
            the bin, reducing the spread of germs. It's perfect for homes,
            offices, and public spaces.
          </p>
          <br />
          <span className="grid grid-flow-row grid-cols-6 w-full">
            <h2 className="col-span-2 text-xl font-bold text-white rounded-lg">
              Auto Mode
            </h2>
            <span className="w-full text-center">
              <Switch setIsChecked={handleDoorAuto} isChecked={isAuto} />
            </span>
          </span>
          <span className="grid grid-flow-row grid-cols-6 w-full">
            <h2 className="col-span-2 text-xl font-bold text-white rounded-lg">
              State
            </h2>
            <span className="w-full text-center">
              <Switch
                setIsChecked={handleDoorManual}
                isChecked={isChecked}
                cmds={["door_closed_manual", "door_open_manual"]}
              />
            </span>
          </span>
        </span>
      </div>
    );
  }
  if (device == "light") {
    return (
      <div className="grid grid-flow-col grid-rows-4 bg-slate-900 bg-opacity-10 shadow-lg  h-full rounded-md backdrop-blur-lg bg-white/12">
        <span className="grid grid-flow-row grid-cols-4 w-full">
          <h2 className="m-8 col-span-3 text-5xl font-bold text-lime-200 rounded-lg">
            SmartLight
          </h2>
          <span className="align-end m-8">
            <span className="w-5 h-5">
              <svg
                className="w-12 h-12 mx-auto"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.5 3H16C15.7239 3 15.5 3.22386 15.5 3.5V3.55891L19 6.35891V3.5C19 3.22386 18.7762 3 18.5 3Z"
                  fill="#fff"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.75 9.5C10.75 8.80964 11.3097 8.25 12 8.25C12.6904 8.25 13.25 8.80964 13.25 9.5C13.25 10.1904 12.6904 10.75 12 10.75C11.3097 10.75 10.75 10.1904 10.75 9.5Z"
                  fill="#fff"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M20.75 10.9605L21.5315 11.5857C21.855 11.8444 22.3269 11.792 22.5857 11.4685C22.8444 11.1451 22.792 10.6731 22.4685 10.4143L14.3426 3.91362C12.9731 2.81796 11.027 2.81796 9.65742 3.91362L1.53151 10.4143C1.20806 10.6731 1.15562 11.1451 1.41438 11.4685C1.67313 11.792 2.1451 11.8444 2.46855 11.5857L3.25003 10.9605V21.25H2.00003C1.58581 21.25 1.25003 21.5858 1.25003 22C1.25003 22.4142 1.58581 22.75 2.00003 22.75H22C22.4142 22.75 22.75 22.4142 22.75 22C22.75 21.5858 22.4142 21.25 22 21.25H20.75V10.9605ZM9.25003 9.5C9.25003 7.98122 10.4812 6.75 12 6.75C13.5188 6.75 14.75 7.98122 14.75 9.5C14.75 11.0188 13.5188 12.25 12 12.25C10.4812 12.25 9.25003 11.0188 9.25003 9.5ZM12.0494 13.25C12.7143 13.25 13.2871 13.2499 13.7459 13.3116C14.2375 13.3777 14.7088 13.5268 15.091 13.909C15.4733 14.2913 15.6223 14.7625 15.6884 15.2542C15.7462 15.6842 15.7498 16.2146 15.75 16.827C15.75 16.8679 15.75 16.9091 15.75 16.9506L15.75 21.25H14.25V17C14.25 16.2717 14.2484 15.8009 14.2018 15.454C14.1581 15.1287 14.0875 15.0268 14.0304 14.9697C13.9733 14.9126 13.8713 14.842 13.546 14.7982C13.1991 14.7516 12.7283 14.75 12 14.75C11.2717 14.75 10.8009 14.7516 10.4541 14.7982C10.1288 14.842 10.0268 14.9126 9.9697 14.9697C9.9126 15.0268 9.84199 15.1287 9.79826 15.454C9.75162 15.8009 9.75003 16.2717 9.75003 17V21.25H8.25003L8.25003 16.9506C8.24999 16.2858 8.24996 15.7129 8.31163 15.2542C8.37773 14.7625 8.52679 14.2913 8.90904 13.909C9.29128 13.5268 9.76255 13.3777 10.2542 13.3116C10.7129 13.2499 11.2858 13.25 11.9507 13.25H12.0494Z"
                  fill="#fff"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.75 9.5C10.75 8.80964 11.3097 8.25 12 8.25C12.6904 8.25 13.25 8.80964 13.25 9.5C13.25 10.1904 12.6904 10.75 12 10.75C11.3097 10.75 10.75 10.1904 10.75 9.5Z"
                  fill="#fff"
                />
              </svg>
            </span>
          </span>
        </span>
        <span className="row-span-3 m-8 text-start">
          <h2 className="text-2xl font-bold text-white rounded-lg">
            Smart Lighting: Illuminate Your Space, Naturally
          </h2>
          <br />
          <p>
            Our Smart Lighting system intelligently adjusts the room’s lighting
            based on ambient light conditions. It automatically turns on when
            it’s dark and dims or turns off when there’s enough natural light.
            Enjoy energy-efficient and convenient lighting that adapts to your
            environment.
          </p>
          <br />
          <span className="grid grid-flow-row grid-cols-6 w-full">
            <h2 className="col-span-2 text-xl font-bold text-white rounded-lg">
              Auto Mode
            </h2>
            <span className="w-full text-center">
              <Switch setIsChecked={handleLightAuto} isChecked={isAuto} />
            </span>
          </span>
          <span className="grid grid-flow-row grid-cols-6 w-full">
            <h2 className="col-span-2 text-xl font-bold text-white rounded-lg">
              State
            </h2>
            <span className="w-full text-center">
              <Switch
                setIsChecked={handleLightManual}
                isChecked={isChecked}
                cmds={["light_off_manual", "light_on_manual"]}
              />
            </span>
          </span>
        </span>
      </div>
    );
  }
  if (device == "alarm") {
    return (
      <div className="grid grid-flow-col grid-rows-4 bg-slate-900 bg-opacity-10 shadow-lg h-full rounded-md backdrop-blur-lg bg-white/12">
        <span className="grid grid-flow-row grid-cols-4 w-full">
          <h2 className="m-8 col-span-3 text-5xl font-bold text-lime-200 rounded-lg">
            Shield
          </h2>
          <span className="align-end m-8">
            <span className="w-5 h-5">
              <svg
                className="w-12 h-12 mx-auto"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.5 3H16C15.7239 3 15.5 3.22386 15.5 3.5V3.55891L19 6.35891V3.5C19 3.22386 18.7762 3 18.5 3Z"
                  fill="#fff"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.75 9.5C10.75 8.80964 11.3097 8.25 12 8.25C12.6904 8.25 13.25 8.80964 13.25 9.5C13.25 10.1904 12.6904 10.75 12 10.75C11.3097 10.75 10.75 10.1904 10.75 9.5Z"
                  fill="#fff"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M20.75 10.9605L21.5315 11.5857C21.855 11.8444 22.3269 11.792 22.5857 11.4685C22.8444 11.1451 22.792 10.6731 22.4685 10.4143L14.3426 3.91362C12.9731 2.81796 11.027 2.81796 9.65742 3.91362L1.53151 10.4143C1.20806 10.6731 1.15562 11.1451 1.41438 11.4685C1.67313 11.792 2.1451 11.8444 2.46855 11.5857L3.25003 10.9605V21.25H2.00003C1.58581 21.25 1.25003 21.5858 1.25003 22C1.25003 22.4142 1.58581 22.75 2.00003 22.75H22C22.4142 22.75 22.75 22.4142 22.75 22C22.75 21.5858 22.4142 21.25 22 21.25H20.75V10.9605ZM9.25003 9.5C9.25003 7.98122 10.4812 6.75 12 6.75C13.5188 6.75 14.75 7.98122 14.75 9.5C14.75 11.0188 13.5188 12.25 12 12.25C10.4812 12.25 9.25003 11.0188 9.25003 9.5ZM12.0494 13.25C12.7143 13.25 13.2871 13.2499 13.7459 13.3116C14.2375 13.3777 14.7088 13.5268 15.091 13.909C15.4733 14.2913 15.6223 14.7625 15.6884 15.2542C15.7462 15.6842 15.7498 16.2146 15.75 16.827C15.75 16.8679 15.75 16.9091 15.75 16.9506L15.75 21.25H14.25V17C14.25 16.2717 14.2484 15.8009 14.2018 15.454C14.1581 15.1287 14.0875 15.0268 14.0304 14.9697C13.9733 14.9126 13.8713 14.842 13.546 14.7982C13.1991 14.7516 12.7283 14.75 12 14.75C11.2717 14.75 10.8009 14.7516 10.4541 14.7982C10.1288 14.842 10.0268 14.9126 9.9697 14.9697C9.9126 15.0268 9.84199 15.1287 9.79826 15.454C9.75162 15.8009 9.75003 16.2717 9.75003 17V21.25H8.25003L8.25003 16.9506C8.24999 16.2858 8.24996 15.7129 8.31163 15.2542C8.37773 14.7625 8.52679 14.2913 8.90904 13.909C9.29128 13.5268 9.76255 13.3777 10.2542 13.3116C10.7129 13.2499 11.2858 13.25 11.9507 13.25H12.0494Z"
                  fill="#fff"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.75 9.5C10.75 8.80964 11.3097 8.25 12 8.25C12.6904 8.25 13.25 8.80964 13.25 9.5C13.25 10.1904 12.6904 10.75 12 10.75C11.3097 10.75 10.75 10.1904 10.75 9.5Z"
                  fill="#fff"
                />
              </svg>
            </span>
          </span>
        </span>
        <span className="row-span-3 m-8 text-start">
          <h2 className="text-2xl font-bold text-white rounded-lg">
            Your Home, Your Security: A Smart Alarm System
          </h2>
          <br />
          <p>
            Take control of your home's security with our user-friendly alarm
            system. Easily arm and disarm the system, set personalized
            schedules, and monitor your property remotely. Our system offers
            advanced features like motion sensors, door/window sensors, and loud
            alarms to keep your home safe and secure.
          </p>
          <br />
          <span className="grid grid-flow-row grid-cols-6 w-full">
            <h2 className="col-span-2 text-xl font-bold text-white rounded-lg">
              State
            </h2>
            <span className="w-full text-center">
              <Switch
                setIsChecked={handleAlarmManual}
                isChecked={isChecked}
                cmds={["alarm_off", "alarm_on"]}
              />
            </span>
          </span>
        </span>
      </div>
    );
  }
  if (device == "fan") {
    return (
      <div className="grid grid-flow-col grid-rows-4 bg-slate-900 bg-opacity-10 shadow-lg h-full rounded-md backdrop-blur-lg bg-white/12">
        <span className="grid grid-flow-row grid-cols-4 w-full">
          <h2 className="m-8 col-span-3 text-5xl font-bold text-lime-200 rounded-lg">
            SmartFan
          </h2>
          <span className="align-end m-8">
            <span className="w-5 h-5">
              <svg
                className="w-12 h-12 mx-auto"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.5 3H16C15.7239 3 15.5 3.22386 15.5 3.5V3.55891L19 6.35891V3.5C19 3.22386 18.7762 3 18.5 3Z"
                  fill="#fff"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.75 9.5C10.75 8.80964 11.3097 8.25 12 8.25C12.6904 8.25 13.25 8.80964 13.25 9.5C13.25 10.1904 12.6904 10.75 12 10.75C11.3097 10.75 10.75 10.1904 10.75 9.5Z"
                  fill="#fff"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M20.75 10.9605L21.5315 11.5857C21.855 11.8444 22.3269 11.792 22.5857 11.4685C22.8444 11.1451 22.792 10.6731 22.4685 10.4143L14.3426 3.91362C12.9731 2.81796 11.027 2.81796 9.65742 3.91362L1.53151 10.4143C1.20806 10.6731 1.15562 11.1451 1.41438 11.4685C1.67313 11.792 2.1451 11.8444 2.46855 11.5857L3.25003 10.9605V21.25H2.00003C1.58581 21.25 1.25003 21.5858 1.25003 22C1.25003 22.4142 1.58581 22.75 2.00003 22.75H22C22.4142 22.75 22.75 22.4142 22.75 22C22.75 21.5858 22.4142 21.25 22 21.25H20.75V10.9605ZM9.25003 9.5C9.25003 7.98122 10.4812 6.75 12 6.75C13.5188 6.75 14.75 7.98122 14.75 9.5C14.75 11.0188 13.5188 12.25 12 12.25C10.4812 12.25 9.25003 11.0188 9.25003 9.5ZM12.0494 13.25C12.7143 13.25 13.2871 13.2499 13.7459 13.3116C14.2375 13.3777 14.7088 13.5268 15.091 13.909C15.4733 14.2913 15.6223 14.7625 15.6884 15.2542C15.7462 15.6842 15.7498 16.2146 15.75 16.827C15.75 16.8679 15.75 16.9091 15.75 16.9506L15.75 21.25H14.25V17C14.25 16.2717 14.2484 15.8009 14.2018 15.454C14.1581 15.1287 14.0875 15.0268 14.0304 14.9697C13.9733 14.9126 13.8713 14.842 13.546 14.7982C13.1991 14.7516 12.7283 14.75 12 14.75C11.2717 14.75 10.8009 14.7516 10.4541 14.7982C10.1288 14.842 10.0268 14.9126 9.9697 14.9697C9.9126 15.0268 9.84199 15.1287 9.79826 15.454C9.75162 15.8009 9.75003 16.2717 9.75003 17V21.25H8.25003L8.25003 16.9506C8.24999 16.2858 8.24996 15.7129 8.31163 15.2542C8.37773 14.7625 8.52679 14.2913 8.90904 13.909C9.29128 13.5268 9.76255 13.3777 10.2542 13.3116C10.7129 13.2499 11.2858 13.25 11.9507 13.25H12.0494Z"
                  fill="#fff"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.75 9.5C10.75 8.80964 11.3097 8.25 12 8.25C12.6904 8.25 13.25 8.80964 13.25 9.5C13.25 10.1904 12.6904 10.75 12 10.75C11.3097 10.75 10.75 10.1904 10.75 9.5Z"
                  fill="#fff"
                />
              </svg>
            </span>
          </span>
        </span>
        <span className="row-span-3 m-8 text-start">
          <h2 className="text-2xl font-bold text-white rounded-lg">
            Smart Fan: Cool Comfort, Optimized
          </h2>
          <br />
          <p>
            Our Smart Fan automatically adjusts its speed based on the room's
            temperature. It provides optimal cooling without overworking,
            ensuring energy efficiency and comfort. Experience the future of
            cooling, where your fan adapts to your environment.
          </p>
          <br />
          <span className="grid grid-flow-row grid-cols-6 w-full">
            <h2 className="col-span-2 text-xl font-bold text-white rounded-lg">
              Auto Mode
            </h2>
            <span className="w-full text-center">
              <Switch setIsChecked={handleFanAuto} isChecked={isAuto} />
            </span>
          </span>
          <span className="grid grid-flow-row grid-cols-6 w-full">
            <h2 className="col-span-2 text-xl font-bold text-white rounded-lg">
              State
            </h2>
            <span className="w-full text-center">
              <Switch
                setIsChecked={handleFanManual}
                isChecked={isChecked}
                cmds={["fan_off_manual", "fan_on_manual"]}
              />
            </span>
          </span>
        </span>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-8 bg-black bg-opacity-30 shadow-lg h-full rounded-md backdrop-blur-lg bg-black/15"></div>
  );
};
