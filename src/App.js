import React, { useState } from 'react';
import { getWeatherQueryAnalysis } from './services/geminiService';

const weatherAPI = {
  key: "fa1d365135fed0bc671f2abf68db4a6c",
  base: "https://api.openweathermap.org/data/2.5/"
};

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState(null);
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    if (e.key === "Enter" && query.trim()) {
      setLoading(true);
      try {
        // 1. Process with Gemini
        const { location, date, focus } = await getWeatherQueryAnalysis(query);
        
        // 2. Fetch weather data
        const response = await fetch(
          `${weatherAPI.base}forecast?q=${location}&units=metric&appid=${weatherAPI.key}`
        );
        const data = await response.json();
        
        // 3. Generate insight
        const weatherInsight = generateInsight(data, date, focus);
        
        setWeather(data);
        setInsight(weatherInsight);
        setQuery('');
      } catch (error) {
        console.error("Error:", error);
        setInsight("Couldn't process your request. Try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const generateInsight = (forecast, date, focus) => {
    const targetDate = date === 'tomorrow' 
      ? new Date(Date.now() + 86400000).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];
    
    const weatherData = forecast.list.find(item => 
      item.dt_txt.includes(targetDate)
    );

    if (!weatherData) return "No forecast available";

    switch(focus) {
      case 'rain':
        return weatherData.rain 
          ? `Rain probability: ${(weatherData.pop * 100).toFixed(0)}%` 
          : "No rain expected";
      case 'temperature':
        return `Expected temperature: ${Math.round(weatherData.main.temp)}°C`;
      case 'wind':
        return `Wind speed: ${weatherData.wind.speed} m/s`;
      default:
        return weatherData.weather[0].description;
    }
  };

  return (
    <div className={`min-h-screen p-5 transition-colors duration-500 ${
      weather?.list?.[0]?.main?.temp > 16 
        ? 'bg-gradient-to-br from-orange-400 to-yellow-500' 
        : 'bg-gradient-to-br from-blue-800 to-cyan-500'
    }`}>
      <main className="max-w-md mx-auto">
        {/* Search Input */}
        <div className="mb-8">
          <input
            type="text"
            className="w-full p-4 rounded-2xl shadow-lg bg-white bg-opacity-80
                     placeholder-gray-500 focus:outline-none focus:ring-2
                     focus:ring-blue-300 text-gray-800"
            placeholder="Ask anything (e.g. 'Will it rain in Delhi tomorrow?')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleSearch}
            disabled={loading}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-white text-center text-xl py-8">Processing...</div>
        )}

        {/* AI Insight */}
        {insight && (
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 mb-6
                        border border-white border-opacity-30 shadow-lg">
            <p className="text-white text-xl font-medium">{insight}</p>
          </div>
        )}

        {/* Weather Card */}
        {weather && (
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6
                        border border-white border-opacity-20 shadow-lg text-white">
            <h2 className="text-2xl font-bold mb-2">
              {weather.city.name}, {weather.city.country}
            </h2>
            <p className="mb-4 opacity-80">
              {new Date(weather.list[0].dt * 1000).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white bg-opacity-10 p-3 rounded-lg">
                <p className="font-medium">Temperature</p>
                <p className="text-2xl font-bold">
                  {Math.round(weather.list[0].main.temp)}°C
                </p>
              </div>
              <div className="bg-white bg-opacity-10 p-3 rounded-lg">
                <p className="font-medium">Humidity</p>
                <p className="text-2xl font-bold">
                  {weather.list[0].main.humidity}%
                </p>
              </div>
              <div className="bg-white bg-opacity-10 p-3 rounded-lg">
                <p className="font-medium">Wind</p>
                <p className="text-2xl font-bold">
                  {weather.list[0].wind.speed} m/s
                </p>
              </div>
              <div className="bg-white bg-opacity-10 p-3 rounded-lg">
                <p className="font-medium">Conditions</p>
                <p className="text-xl font-bold capitalize">
                  {weather.list[0].weather[0].description}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;