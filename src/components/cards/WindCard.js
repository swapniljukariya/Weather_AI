const WindCard = ({ speed, deg, gust }) => (
    <div className="bg-blue-100 p-4 rounded-xl shadow text-center">
      <h2 className="text-xl font-semibold">💨 Wind</h2>
      <p>Speed: {speed} m/s</p>
      <p>Direction: {deg}°</p>
      <p>Gust: {gust ?? "N/A"} m/s</p>
    </div>
  );
  export default WindCard;
  