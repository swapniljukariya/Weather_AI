import React from "react";
import TemperatureCard from "./cards/TemperatureCard";
import WindCard from "./cards/WindCard";
import CloudCard from "./cards/CloudCard";
import RainForecastCard from "./cards/RainForecastCard";
import HumidityCard from "./cards/HumidityCard";
import GeneralWeatherCard from "./cards/GeneralWeatherCard";

const WeatherInfoRenderer = ({ data, parameters }) => {
  if (!data || typeof data !== "object") {
    return <div className="text-center text-gray-500">No data available</div>;
  }

  const cardMap = {
    temp: <TemperatureCard temp={data.temp} />,
    wind: <WindCard speed={data.wind} />,
    clouds: <CloudCard coverage={data.clouds} />,
    rain: <RainForecastCard rain={data.rain} />,
    humidity: <HumidityCard humidity={data.humidity} />,
  };

  if (!parameters || parameters.length === 0) {
    return <GeneralWeatherCard data={data} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
      {parameters.map((param, idx) =>
        cardMap[param] ? (
          <div key={idx} className="animate-fade-in">{cardMap[param]}</div>
        ) : null
      )}
    </div>
  );
};

export default WeatherInfoRenderer;
