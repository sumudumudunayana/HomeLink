export default function WeatherReport() {
  return (
    <div className="rounded-md">
      <div className="grid grid-cols-6 gap-4 h-full w-full rounded-md">
        <div className="h-full shadow-lg  col-span-3 rounded-l-md w-full">
          <div className="w-full rounded-l-md h-full bg-opacity-15 bg-white"></div>
        </div>
        <div className="h-full shadow-lg col-span-3 rounded-md w-full">
          <div className="p-8 w-full rounded-md h-full bg-opacity-15 bg-white">
            <div className="grid grid-cols-2 grid-flow-row h-full w-full items-center">
              <span className="text-center w-full">
                <h1 className="text-6xl text-gray-100">10:39:43</h1>
                <span className="text-xl text-gray-100">2024/11/11</span>
              </span>
              <h1 className="text-6xl text-gray-100">Welcome Ishanka</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
