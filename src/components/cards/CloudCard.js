const CloudCard = ({ coverage }) => (
    <div className="bg-gray-100 p-4 rounded-xl shadow text-center">
      <h2 className="text-xl font-semibold">☁️ Clouds</h2>
      <p>Cloud Coverage: {coverage}%</p>
    </div>
  );
  export default CloudCard;
  