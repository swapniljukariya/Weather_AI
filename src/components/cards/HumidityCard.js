const HumidityCard = ({ humidity }) => (
    <div className="bg-green-100 p-4 rounded-xl shadow text-center">
      <h2 className="text-xl font-semibold">💧 Humidity</h2>
      <p>{humidity}%</p>
    </div>
  );
  export default HumidityCard;
  