const GeneralWeatherCard = ({ data }) => (
  <div className="bg-white p-4 rounded-xl shadow space-y-2 text-center">
    <h2 className="text-xl font-bold">🌍 Weather in {data.city}, {data.country}</h2>
    <p>🌤️ {data.weather.main} - {data.weather.description}</p>
    <img
      src={`https://openweathermap.org/img/wn/${data.weather.icon}@2x.png`}
      alt={data.weather.description}
      className="mx-auto"
    />
    <p>🌡️ Temp: {data.temp} °C (Feels like {data.feels_like} °C)</p>
    <p>💧 Humidity: {data.humidity}%</p>
    <p>💨 Wind: {data.wind_speed} m/s</p>
    <p>☁️ Clouds: {data.clouds}%</p>
    <p>🌧️ Rain: {typeof data.rain === "number" ? `${data.rain} mm` : data.rain}</p>
  </div>
);
export default GeneralWeatherCard;
