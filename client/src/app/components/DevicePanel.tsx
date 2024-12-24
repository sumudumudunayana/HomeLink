import { HomeIcon } from "./Images";
import { Switch } from "./Switch";
import { Weather } from "./Weather";

interface DevicePanelProps {
  device: string;
  isChecked: boolean;
  setIsChecked: (value: boolean) => void;
  isAuto: boolean;
  setAuto: (value: boolean) => void;
  webSocket: WebSocket;
  setDevice: (value: string) => void;
  adminSet: (value: boolean) => void;
}

interface AlarmPanelProps {
  device: string;
  isChecked: boolean;
  setIsChecked: (value: boolean) => void;
  isAuto: boolean;
  setAuto: (value: boolean) => void;
  webSocket: WebSocket;
  setDevice: (value: string) => void;
  adminSet: (value: boolean) => void;
  shieldStatus: boolean;
  setShieldStatus: (value: boolean) => void;
}

export const DevicePanel: React.FC<DevicePanelProps | AlarmPanelProps> = ({
  device,
  isChecked,
  setIsChecked,
  isAuto,
  setAuto,
  webSocket,
  setDevice,
  adminSet,
  shieldStatus,
  setShieldStatus,
}) => {
  // Helper functions
  const sendCommand = (command: string) => {
    webSocket.send(JSON.stringify({ cmd: command }));
  };

  const toggleAutoMode = (
    autoCommand: string,
    manualCommand: { on: string; off: string }
  ) => {
    const newAutoState = !isAuto;
    if (newAutoState) {
      sendCommand(autoCommand);
    } else {
      const manualCmd = isChecked ? manualCommand.on : manualCommand.off;
      sendCommand(manualCmd);
    }
    setAuto(newAutoState);
  };

  const toggleState = (command: string) => {
    sendCommand(command);
    setIsChecked(command.includes("on") || command.includes("open"));
  };

  const toggleShieldState = (command: string) => {
    sendCommand(command);
    setShieldStatus(command.includes("on"));
  };

  const getDeviceContent = (
    title: string,
    description: { heading: string; body: string },
    autoHandler: (() => void) | null,
    stateHandler: ((cmd: string) => void) | null,
    stateCommands: { on: string; off: string } | null,
    shieldHandler: ((cmd: string) => void) | null,
    shieldStateCommands: { on: string; off: string } | null
  ) => (
    <>
      <span className="grid grid-flow-row grid-cols-4 w-full">
        <h2 className="m-8 col-span-3 text-5xl font-bold text-lime-200 rounded-lg">
          {title}
        </h2>
        <button onClick={() => setDevice("home")} className="align-end m-8">
          <HomeIcon />
        </button>
      </span>
      <span className="row-span-3 m-8 text-start">
        <h2 className="text-2xl font-bold text-white rounded-lg">
          {description.heading}
        </h2>
        <br />
        <p>{description.body}</p>
        <br />
        {shieldHandler && shieldStateCommands && (
          <span className="grid grid-flow-row grid-cols-6 w-full">
            <h2 className="col-span-2 text-xl font-bold text-white rounded-lg">
              Shields
            </h2>
            <span className="w-full text-center">
              <Switch
                setIsChecked={shieldHandler}
                isChecked={shieldStatus}
                cmds={[shieldStateCommands.off, shieldStateCommands.on]}
              />
            </span>
          </span>
        )}
        {autoHandler && (
          <span className="grid grid-flow-row grid-cols-6 w-full">
            <h2 className="col-span-2 text-xl font-bold text-white rounded-lg">
              Auto Mode
            </h2>
            <span className="w-full text-center">
              <Switch
                setIsChecked={autoHandler}
                isChecked={isAuto}
                adminSet={adminSet}
              />
            </span>
          </span>
        )}
        {stateHandler && stateCommands && (
          <span className="grid grid-flow-row grid-cols-6 w-full">
            <h2 className="col-span-2 text-xl font-bold text-white rounded-lg">
              {shieldHandler ? "Alarm" : "State"}
            </h2>
            <span className="w-full text-center">
              <Switch
                setIsChecked={stateHandler}
                isChecked={isChecked}
                cmds={[stateCommands.off, stateCommands.on]}
                disabled={shieldHandler ? !shieldStatus : isAuto}
                adminSet={adminSet}
              />
            </span>
          </span>
        )}
      </span>
    </>
  );

  // Device-specific configuration
  const deviceConfig: Record<
    string,
    {
      title: string;
      description: { heading: string; body: string };
      autoHandler: (() => void) | null;
      shieldHandler: ((cmd: string) => void) | null;
      shieldStateCommands: { on: string; off: string } | null;
      stateHandler: ((cmd: string) => void) | null;
      stateCommands: { on: string; off: string } | null;
    }
  > = {
    door: {
      title: "SmartBin",
      description: {
        heading: "Introducing the Smart Dustbin: A Hands-Free Hygiene Solution",
        body: `Our Smart Dustbin is a hygienic and convenient solution for waste disposal. 
        Equipped with advanced motion sensors, it automatically opens its lid when it detects a hand approaching. 
        No need to touch the bin, reducing the spread of germs. It's perfect for homes, offices, and public spaces.`,
      },
      shieldHandler: null,
      shieldStateCommands: null,
      autoHandler: () =>
        toggleAutoMode("door_operate_auto", {
          on: "door_open_manual",
          off: "door_closed_manual",
        }),
      stateHandler: (cmd) => toggleState(cmd),
      stateCommands: { on: "door_open_manual", off: "door_closed_manual" },
    },
    light: {
      title: "SmartLight",
      description: {
        heading: "Smart Lighting: Illuminate Your Space, Naturally",
        body: `Our Smart Lighting system intelligently adjusts the room’s lighting based on ambient light conditions. 
        It automatically turns on when it’s dark and dims or turns off when there’s enough natural light. 
        Enjoy energy-efficient and convenient lighting that adapts to your environment.`,
      },
      shieldHandler: null,
      shieldStateCommands: null,
      autoHandler: () =>
        toggleAutoMode("light_operate_auto", {
          on: "light_on_manual",
          off: "light_off_manual",
        }),
      stateHandler: (cmd) => toggleState(cmd),
      stateCommands: { on: "light_on_manual", off: "light_off_manual" },
    },
    alarm: {
      title: "SmartShield",
      description: {
        heading: "Your Home, Your Security: A Smart Alarm System",
        body: `Take control of your home's security with our user-friendly alarm system. 
        Easily arm and disarm the system, set personalized schedules, and monitor your property remotely. 
        Our system offers advanced features like motion sensors, door/window sensors, and loud alarms to keep your home safe and secure.`,
      },
      shieldHandler: (cmd) => toggleShieldState(cmd),
      shieldStateCommands: { on: "shield_on", off: "shield_off" },
      autoHandler: null,
      stateHandler: (cmd) => toggleState(cmd),
      stateCommands: { on: "alarm_on", off: "alarm_off" },
    },
    fan: {
      title: "SmartFan",
      description: {
        heading: "Smart Fan: Cool Comfort, Optimized",
        body: `Our Smart Fan automatically adjusts its speed based on the room's temperature. 
        It provides optimal cooling without overworking, ensuring energy efficiency and comfort. 
        Experience the future of cooling, where your fan adapts to your environment.`,
      },
      shieldHandler: null,
      shieldStateCommands: null,
      autoHandler: () =>
        toggleAutoMode("fan_operate_auto", {
          on: "fan_on_manual",
          off: "fan_off_manual",
        }),
      stateHandler: (cmd) => toggleState(cmd),
      stateCommands: { on: "fan_on_manual", off: "fan_off_manual" },
    },
  };

  const currentDevice = deviceConfig[device];
  if (currentDevice) {
    return (
      <div className="grid grid-flow-col grid-rows-4 bg-slate-900 bg-opacity-10 shadow-lg h-full rounded-md backdrop-blur-lg bg-white/12">
        {getDeviceContent(
          currentDevice.title,
          currentDevice.description,
          currentDevice.autoHandler,
          currentDevice.stateHandler,
          currentDevice.stateCommands,
          currentDevice.shieldHandler,
          currentDevice.shieldStateCommands
        )}
      </div>
    );
  }

  // Default fallback
  return (
    <div className="bg-slate-200 bg-opacity-10 shadow-lg h-full rounded-md backdrop-blur-lg bg-white/12">
      <Weather />
    </div>
  );
};
