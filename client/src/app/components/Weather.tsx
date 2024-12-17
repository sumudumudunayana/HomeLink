import React, { useEffect, useState } from "react";
import {
  CloudIcon,
  WindIcon,
  HumidityIcon,
  PressureIcon,
  WeatherStatus1,
} from "./Images";

export const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch weather data from the backend API
  const fetchWeather = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/weather/report"); // Call your BE API
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setWeatherData(data); // Update the state with API data
    } catch (err) {
      setError(err.message); // Handle errors
    }
  };

  useEffect(() => {
    fetchWeather(); // Fetch data when the component mounts
  }, []);

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (!weatherData) {
    return (
      <div className="flex w-full h-full justify-center items-center">
        <div className="w-16 h-16 border-8 border-t-transparent border-solid rounded-full border-[#d9f99d] animate-spin"></div>
      </div>
    );
  }

  const { location, current } = weatherData.report;

  return (
    <div className="grid grid-cols-2 col-span-12 w-full h-full rounded-md">
      <div className="w-full flex flex-row items-center justify-center rounded-l-md">
        <div className="grid grid-rows-4">
          <div className="row-span-3 flex items-center justify-center">
            <WeatherStatus1 />
          </div>
          <div>
            <p className="text-xl text-center font-bold">
              {current.condition.text.toUpperCase()}
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-rows-10 w-full h-full text-white bg-[#151527] bg-opacity-80 flex flex-row">
        <div className="row-start-2 row-span-4 h-full w-full text-center">
          <p className="text-4xl">
            <span className="text-8xl text-lime-200 font-bold">
              {current.temp_c}
            </span>
            °C
          </p>
          <h2 className="text-3xl mt-4 font-bold">{location.name}</h2>
          <p className="text-xl text-gray-300">
            {location.region}, {location.country}
          </p>
          <br />
        </div>
        <div className="row-span-4 h-full w-full">
          <div className="grid grid-rows-4 text-gray-300 w-full h-full">
            {/* Humidity */}
            <div className="flex flex-row items-center w-full">
              <div className="grid grid-cols-2 w-full">
                <div className="w-full text-end">
                  <p className="text-xl font-semibold">{current.humidity}%</p>
                  <p className="text-xs font-light">Humidity</p>
                </div>
                <HumidityIcon />
              </div>
            </div>
            {/* Wind */}
            <div className="flex flex-row items-center w-full">
              <div className="grid grid-cols-2 w-full">
                <div className="text-end w-full">
                  <p className="text-xl font-semibold">
                    {current.wind_kph} KPH
                  </p>
                  <p className="text-xs font-light">Wind({current.wind_dir})</p>
                </div>
                <WindIcon />
              </div>
            </div>
            {/* Wind */}
            <div className="flex flex-row items-center w-full">
              <div className="grid grid-cols-2 w-full">
                <div className="text-end w-full">
                  <p className="text-xl font-semibold">
                    {current.pressure_mb} MB
                  </p>
                  <p className="text-xs font-light">Pressure</p>
                </div>
                <PressureIcon />
              </div>
            </div>
            {/* Clouds */}
            <div className="flex flex-row items-center w-full">
              <div className="grid grid-cols-2 items-center w-full">
                <div className="text-end w-full">
                  <p className="text-xl font-semibold">{current.cloud}</p>
                  <p className="text-xs font-light">Cloudy</p>
                </div>
                <CloudIcon />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
