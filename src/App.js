import { useState } from "react";
import WeatherInfoRenderer from "./components/WeatherInfoRenderer";
import { getGeminiPayload } from "./services/geminiService";
import { fetchWeatherData } from "./services/weatherService";

export default function App() {
  const [query, setQuery] = useState("");
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [parameters, setParameters] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const payload = await getGeminiPayload(query);
      if (!payload) throw new Error("Failed to get payload from Gemini.");

      const data = await fetchWeatherData(payload);
      if (!data) throw new Error("Failed to fetch weather data.");

      setWeatherInfo(data);
      setParameters(payload.parameters || []);
    } catch (error) {
      console.error("Something went wrong:", error.message);
      setWeatherInfo(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-6">
      <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl shadow-2xl space-y-6">
        <h1 className="text-3xl font-extrabold text-center text-blue-800">
          🌦️ Ask WeatherBot
        </h1>

        <input
          type="text"
          className="w-full border text-lg p-4 rounded-xl"
          placeholder="e.g., Will it rain in Delhi tomorrow?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />

        <button
          className="w-full text-lg bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition duration-300"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Fetching..." : "Get Weather"}
        </button>

        {loading && (
          <p className="text-center text-gray-600 text-lg font-medium animate-pulse">
            Fetching weather data...
          </p>
        )}

        {!loading && weatherInfo ? (
          <WeatherInfoRenderer data={weatherInfo} parameters={parameters} />
        ) : (
          !loading && (
            <p className="text-center text-gray-500 text-lg">No data to show yet.</p>
          )
        )}
      </div>
    </div>
  );
}
