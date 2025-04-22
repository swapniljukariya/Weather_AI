const TemperatureCard = ({ temp, feelsLike }) => (
    <div className="bg-yellow-100 p-4 rounded-xl shadow text-center">
      <h2 className="text-xl font-semibold">🌡️ Temperature</h2>
      <p className="text-3xl">{temp} °C</p>
      <p className="text-gray-700">Feels like: {feelsLike} °C</p>
    </div>
  );
  export default TemperatureCard;
  