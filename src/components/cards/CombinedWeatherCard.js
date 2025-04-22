const CombinedWeatherCard = ({ data, params }) => (
    <div className="p-4 rounded-xl shadow bg-purple-100">
      <h2>🌦️ Combined Weather</h2>
      {params.includes("temp") && <p>Temp: {data?.main?.temp}°C</p>}
      {params.includes("rain") && <p>Rain: {data?.rain?.["1h"] || 0} mm</p>}
      {params.includes("wind") && <p>Wind: {data?.wind?.speed} m/s</p>}
      {params.includes("clouds") && <p>Clouds: {data?.clouds?.all}%</p>}
    </div>
  );
  export default CombinedWeatherCard;
  