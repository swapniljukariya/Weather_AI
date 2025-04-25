import React from "react";
import {
  TemperatureCard,
  WindCard,
  CloudCard,
  RainCard,
  HumidityCard,
  PressureCard,
  VisibilityCard,
  SkyConditionCard,
  GeneralWeatherCard,
  FeelsLikeCard,
  WeatherForecastCard,
} from "./cards/WeatherCards";

const WeatherInfoRenderer = ({ data, parameters = [], type = "current" }) => {
  // Map for weather card components
  const cardComponents = {
    temperature: () => <TemperatureCard {...data.main} />,
    wind: () => <WindCard {...data.wind} />,
    clouds: () => <CloudCard coverage={data.clouds?.all} />,
    rain: () => <RainCard rain={data.rain?.["1h"] || data.rain?.["3h"]} />,
    humidity: () => <HumidityCard humidity={data.main?.humidity} />,
    pressure: () => (
      <PressureCard
        pressure={data.main?.pressure}
        sea_level={data.main?.sea_level}
        grnd_level={data.main?.grnd_level}
      />
    ),
    visibility: () => <VisibilityCard visibility={data.visibility} />,
    sky: () => (
      <SkyConditionCard
        condition={data.weather?.[0]?.main}
        description={data.weather?.[0]?.description}
        icon={data.weather?.[0]?.icon}
      />
    ),
    feels_like: () => <FeelsLikeCard feelsLike={data.main?.feels_like} />,
    forecast: () =>
      data.forecast ? (
        <WeatherForecastCard forecast={data.forecast} />
      ) : (
        <p className="text-blue-700 col-span-full">
          Forecast data is not available.
        </p>
      ),
    general: () =>
      type === "current" ? <GeneralWeatherCard data={data} /> : null,
  };

  // Render only the components included in parameters
  const selectedComponents = parameters
    .map((param) => cardComponents[param])
    .filter(Boolean);

  return (
    <div className="max-w-screen-2xl mx-auto p-6">
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {selectedComponents.length > 0 ? (
          selectedComponents.map((CardComponent, index) => (
            <div key={index} className="bg-white p-4 rounded-2xl shadow-md h-full">
              {CardComponent()}
            </div>
          ))
        ) : (
          <p className="text-blue-700 col-span-full text-lg text-center">
            ❌ Sorry, I couldn’t find a matching weather card for your request.
          </p>
        )}
      </div>
    </div>
  );
};

export default WeatherInfoRenderer;
