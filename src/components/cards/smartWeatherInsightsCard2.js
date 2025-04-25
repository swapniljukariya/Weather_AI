import React from "react";
import { FaUmbrella, FaSun, FaCloud, FaTint, FaWind } from "react-icons/fa";
import { BsFillCloudRainHeavyFill, BsCloudSun } from "react-icons/bs";

// UmbrellaAdviceCard
export const UmbrellaAdviceCard = ({ rain, clouds }) => {
  const rainMessage = rain > 0 ? (
    <span>Yes, it might rain! ({clouds} clouds)</span>
  ) : (
    <span>No rain expected. ({clouds} clouds)</span>
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4">
      <FaUmbrella className="text-blue-500 text-4xl" />
      <div>
        <h3 className="text-2xl font-semibold text-blue-500">Umbrella Advice</h3>
        <p className="text-gray-700 mt-2">{rainMessage}</p>
      </div>
    </div>
  );
};

// SunshineCard
export const SunshineCard = ({ weather }) => {
  const sunshineDescription = weather?.[0]?.description || "Data not available";

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4">
      <FaSun className="text-yellow-500 text-4xl" />
      <div>
        <h3 className="text-2xl font-semibold text-yellow-500">Sunshine</h3>
        <p className="text-gray-700 mt-2">{sunshineDescription}</p>
      </div>
    </div>
  );
};

// VisibilityCard
export const VisibilityCard = ({ clouds }) => {
  const visibilityMessage = clouds > 50 ? "Poor Visibility" : "Clear Visibility";

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4">
      <BsCloudSun className="text-green-500 text-4xl" />
      <div>
        <h3 className="text-2xl font-semibold text-green-500">Visibility</h3>
        <p className="text-gray-700 mt-2">{visibilityMessage}</p>
      </div>
    </div>
  );
};

// EnhancedHumidityCard
export const EnhancedHumidityCard = ({ humidity }) => {
  const humidityMessage = humidity !== undefined ? `Humidity: ${humidity}%` : "Humidity data not available";

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4">
      <FaTint className="text-indigo-500 text-4xl" />
      <div>
        <h3 className="text-2xl font-semibold text-indigo-500">Humidity</h3>
        <p className="text-gray-700 mt-2">{humidityMessage}</p>
      </div>
    </div>
  );
};

// GeneralWeatherCard
export const GeneralWeatherCard = ({ data }) => {
  if (!data) return <div>No data available</div>;

  const { main, weather } = data;
  const description = weather?.[0]?.description || "No weather data";
  const temp = main?.temp ? `${main.temp}°C` : "Temperature data not available";
  const feelsLike = main?.feels_like ? `${main.feels_like}°C` : "Feels like data not available";

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-2xl font-semibold text-blue-600">Weather Overview</h3>
      <div className="flex items-center space-x-4 mt-4">
        <FaCloud className="text-gray-500 text-4xl" />
        <div>
          <p className="text-gray-700">{description}</p>
          <p className="text-gray-700">{temp}</p>
          <p className="text-gray-700">{feelsLike}</p>
        </div>
      </div>
    </div>
  );
};

// GeneralForecastCard
export const GeneralForecastCard = ({ forecast }) => {
  if (!forecast || !Array.isArray(forecast) || forecast.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-2xl font-semibold text-orange-500">General Forecast</h3>
        <p className="text-gray-700 mt-2">No forecast data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-2xl font-semibold text-orange-500">General Forecast</h3>
      {forecast.map((item, idx) => (
        <div key={idx} className="mt-2">
          <p className="text-gray-700">Temp: {item.main.temp}°C</p>
          <p className="text-gray-700">{item.weather[0]?.description}</p>
        </div>
      ))}
    </div>
  );
};

// StormAlertCard
export const StormAlertCard = ({ wind }) => {
  const windSpeed = wind?.speed ? `${wind.speed} km/h` : "Wind speed data not available";
  const windGusts = wind?.gust ? `${wind.gust} km/h` : "Wind gusts data not available";

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4">
      <FaWind className="text-red-500 text-4xl" />
      <div>
        <h3 className="text-2xl font-semibold text-red-500">Wind Conditions</h3>
        <p className="text-gray-700 mt-2">Wind Speed: {windSpeed}</p>
        <p className="text-gray-700 mt-2">Wind Gusts: {windGusts}</p>
      </div>
    </div>
  );
};

// ForecastListCard
export const ForecastListCard = ({ forecast }) => {
  if (!forecast || !Array.isArray(forecast) || forecast.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-2xl font-semibold text-purple-500">Forecast List</h3>
        <p className="text-gray-700 mt-2">No forecast data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-2xl font-semibold text-purple-500">Forecast List</h3>
      {forecast.map((item, idx) => (
        <div key={idx} className="mt-2">
          <p className="text-gray-700">Weather: {item.weather[0]?.description}</p>
          <p className="text-gray-700">Temp: {item.main.temp}°C</p>
        </div>
      ))}
    </div>
  );
};
