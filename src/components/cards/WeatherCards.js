import React from "react";

const Card = ({ title, emoji, children }) => (
  <div className="bg-white p-6 rounded-2xl w-full sm:w-56 shadow-lg text-blue-900 space-y-4 border border-blue-200">
    <h2 className="text-xl font-semibold flex items-center gap-3">
      <span className="text-2xl">{emoji}</span> {title}
    </h2>
    {children}
  </div>
);

export const TemperatureCard = ({ temp, feels_like, min, max }) => (
  <Card title="Temperature" emoji="🌡️">
    <p>Current: {temp}°C</p>
    <p>Feels Like: {feels_like}°C</p>
    <p>Min: {min}°C / Max: {max}°C</p>
  </Card>
);

export const WindCard = ({ speed, deg, gust }) => (
  <Card title="Wind" emoji="💨">
    <p>Speed: {speed ?? "N/A"} m/s</p>
    <p>Direction: {deg ?? "N/A"}°</p>
    <p>Gust: {gust ?? "N/A"} m/s</p>
  </Card>
);

export const CloudCard = ({ coverage }) => (
  <Card title="Cloud Coverage" emoji="☁️">
    <p>{coverage ?? "N/A"}%</p>
  </Card>
);

export const RainCard = ({ rain }) => (
  <Card title="Rain Forecast" emoji="🌧️">
    <p>{rain ? `${rain} mm` : "No rain expected"}</p>
  </Card>
);

export const HumidityCard = ({ humidity }) => (
  <Card title="Humidity" emoji="💧">
    <p>{humidity ?? "N/A"}%</p>
  </Card>
);

export const PressureCard = ({ pressure, sea_level, grnd_level }) => (
  <Card title="Pressure" emoji="🔽">
    <p>Pressure: {pressure ?? "N/A"} hPa</p>
    {sea_level && <p>Sea Level: {sea_level} hPa</p>}
    {grnd_level && <p>Ground Level: {grnd_level} hPa</p>}
  </Card>
);

export const VisibilityCard = ({ visibility }) => (
  <Card title="Visibility" emoji="🌁">
    <p>{visibility != null ? `${visibility / 1000} km` : "N/A"}</p>
  </Card>
);

export const SkyConditionCard = ({ condition, description, icon }) => (
  <Card title="Sky" emoji="🌤️">
    <div className="flex items-center gap-3">
      <img
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt={description}
        className="w-12 h-12"
      />
      <p>
        {condition} - <em className="text-gray-600">{description}</em>
      </p>
    </div>
  </Card>
);

export const GeneralWeatherCard = ({ data }) => (
  <div className="space-y-12  w-[50vw]">
    <h2 className="text-2xl font-semibold text-blue-800 flex items-center gap-2">
      📋 General Overview
    </h2>

    <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 px-4 py-6">
      <SkyConditionCard
        condition={data.weather?.[0]?.main}
        description={data.weather?.[0]?.description}
        icon={data.weather?.[0]?.icon}
      />
      <TemperatureCard
        temp={data.main?.temp}
        feels_like={data.main?.feels_like}
        min={data.main?.temp_min}
        max={data.main?.temp_max}
      />
      <HumidityCard humidity={data.main?.humidity} />
      <WindCard
        speed={data.wind?.speed}
        deg={data.wind?.deg}
        gust={data.wind?.gust}
      />
      <CloudCard coverage={data.clouds?.all} />
      <RainCard rain={data.rain?.["1h"] || data.rain?.["3h"]} />
      <PressureCard
        pressure={data.main?.pressure}
        sea_level={data.main?.sea_level}
        grnd_level={data.main?.grnd_level}
      />
      <VisibilityCard visibility={data.visibility} />
    </div>
  </div>
);

export const FeelsLikeCard = ({ feelsLike }) => (
  <Card title="Feels Like" emoji="🌬️">
    <p>{feelsLike}°C</p>
  </Card>
);

export const WeatherForecastCard = ({ forecast }) => (
    <div className="p-4 w-[35vw] mr-4">
      <h2 className="text-2xl font-bold text-center m-9  ">Weather Forecast 📅</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-x-80 ">
        {forecast?.map((forecastItem, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-lg text-center w-[15vw] space-y-4"
          >
            {/* Day */}
            <p className="text-xl font-semibold">{forecastItem.day}</p>
  
            {/* Weather Icon */}
            <div className="flex justify-center">
              <img
                src={`https://openweathermap.org/img/wn/${forecastItem.icon}@2x.png`}
                alt={forecastItem.weather}
                className="w-16 h-16"
              />
            </div>
  
            {/* Temperature */}
            <p className="text-3xl font-bold">{forecastItem.avgTemp}°C</p>
  
            {/* Weather Description */}
            <p className="text-md text-gray-600">{forecastItem.weather}</p>
  
            {/* Additional Info */}
            <div className="text-sm text-gray-500 space-y-2">
              <p>Humidity: {forecastItem.humidity}%</p>
              <p>Pressure: {forecastItem.pressure} hPa</p>
              <p>Wind Speed: {forecastItem.windSpeed} m/s</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  
  