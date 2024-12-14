import { LogoIcon } from "./Images";
import Clock from "./Clock";

export default function Greeting() {
  return (
    <div className="rounded-md">
      <div className="grid grid-cols-6 gap-4 h-full w-full rounded-md">
        <div className="h-full shadow-lg col-span-3 rounded-md w-full">
          <div className="p-8 w-full rounded-md h-full bg-opacity-15 bg-white">
            <div className="grid grid-cols-2 grid-flow-row h-full w-full items-center">
              <h1 className="text-4xl text-gray-100">
                Welcome{" "}
                <span className="font-bold text-6xl text-lime-200">
                  Ishanka
                </span>
              </h1>
              <span className="text-center w-full">
                <h1 className="text-8xl text-gray-100">
                  <Clock />
                </h1>
                <span className="text-xl text-gray-100">
                  {new Date().toLocaleString("en-En", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className="h-full shadow-lg  col-span-3 rounded w-full">
          <div className="w-full rounded h-full bg-opacity-15 bg-white">
            <div className="p-8 grid grid-cols-8 bg-slate-900 bg-opacity-10 shadow-lg h-full w-full rounded-md backdrop-blur-lg bg-white/12">
              <span className="col-span-6 text-start">
                <h1 className="text-5xl font-bold text-white rounded-lg">
                  <span className="text-lime-200 font-bold">Gaia</span>: Your
                  Intelligent Home
                </h1>
                <br />
                <p className="text-lg">
                  Gaia is a cutting-edge home automation system that simplifies
                  your life. Control your home with voice commands, personalize
                  your environment, save energy, enhance security, and enjoy a
                  seamless user experience.
                </p>
              </span>
              <span className="col-span-2 flex justify-center items-center">
                <LogoIcon />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
