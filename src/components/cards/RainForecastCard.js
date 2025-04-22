const RainForecastCard = ({ rain }) => (
  <div className="bg-indigo-100 p-4 rounded-xl shadow text-center">
    <h2 className="text-xl font-semibold">🌧️ Rain Forecast</h2>
    <p>{typeof rain === "number" ? `Rain: ${rain} mm` : rain}</p>
  </div>
);
export default RainForecastCard;
