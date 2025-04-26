// src/App.js
import React, { useState } from 'react';
import { getGeminiPayload } from './api/geminiAPI';
import { fetchWeatherData } from './api/weatherAPI';
import {
  GeneralWeatherCard,
  TemperatureCard,
  HumidityCard,
  PressureCard,
  WindCard,
  CloudCard,
  VisibilityCard,
  ForecastCard
} from './components/WeatherCards';

const App = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [recommendedCard, setRecommendedCard] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setWeatherData(null);
    setRecommendedCard(null);

    try {
      // Step 1: Get structured data from Gemini
      const geminiResponse = await getGeminiPayload(query);
      console.log("Gemini Response:", geminiResponse);
      if (!geminiResponse) {
        throw new Error('Failed to analyze your query');
      }

      // Step 2: Fetch weather data
      const weatherResponse = await fetchWeatherData(geminiResponse.location);
      if (!weatherResponse) {
        throw new Error('Failed to fetch weather data');
      }

      setWeatherData(weatherResponse);

      // Step 3: Determine which single card to show based on Gemini's first parameter
      const { parameters } = geminiResponse;
      if (parameters && parameters.length > 0) {
        setRecommendedCard(parameters[0]); // Take the first parameter only
      }

    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const renderRecommendedCard = () => {
    if (!weatherData) return null;
  
    const { weather, forecast } = weatherData;
  
    // Check if forecast was specifically requested
    const wantsForecast = recommendedCard?.includes('forecast');
    const hasForecastData = forecast?.length > 0;
  
    if (wantsForecast) {
      return hasForecastData ? (
        <ForecastCard forecast={forecast} />
      ) : (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
          Forecast data not available
        </div>
      );
    }
  
    // Rest of your card logic...
    return <GeneralWeatherCard {...weather} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
            Weather AI Assistant
          </h1>
          <p className="text-gray-600">
            Ask about weather conditions and get detailed information
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about weather (e.g., 'What's the visibility in Delhi?')"
              className="flex-grow p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing...' : 'Ask'}
            </button>
          </form>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Analyzing your weather query...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded">
            <p>{error}</p>
          </div>
        )}

        {weatherData && recommendedCard && (
          <div className="grid grid-cols-1 gap-6">
            {renderRecommendedCard()}
          </div>
        )}

        {weatherData && !recommendedCard && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-8 rounded">
            <p>We can't provide the specific weather information you requested.</p>
          </div>
        )}

        {!loading && !weatherData && (
          <div className="text-center py-12 text-gray-500">
            <p>Ask a weather question to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;