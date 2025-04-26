import React, { useState } from 'react';
import { 
  FaCloudSunRain, 
  FaSun, 
  FaCloud, 
  FaCloudRain, 
  FaWind,
  FaTemperatureHigh,
  FaTint,
  FaCompressAlt,
  FaEye
} from 'react-icons/fa';
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
    if (!query.trim()) {
      setError('Please enter a weather query');
      return;
    }

    setLoading(true);
    setError(null);
    setWeatherData(null);
    setRecommendedCard(null);

    try {
      // Step 1: Analyze query with Gemini
      const geminiResponse = await getGeminiPayload(query);
      console.log("Gemini Response:", geminiResponse);
      
      if (!geminiResponse) {
        throw new Error('Our weather assistant is having trouble understanding your query.');
      }

      if (!geminiResponse.location) {
        throw new Error('Please include a location (e.g., "humidity in Delhi")');
      }

      // Step 2: Fetch weather data
      const weatherResponse = await fetchWeatherData(geminiResponse.location);
      
      if (!weatherResponse) {
        throw new Error('Weather data unavailable for this location.');
      }

      if (weatherResponse.cod === "404") {
        throw new Error('Location not found. Please check the spelling.');
      }

      setWeatherData(weatherResponse);

      // Step 3: Determine which card to show
      const { parameters, type } = geminiResponse;
      const cardPriority = [
        'forecast', 'humidity', 'temp', 'feels_like', 
        'wind', 'pressure', 'cloud', 'visibility'
      ];
      
      // Special handling for forecast type
      if (type === 'forecast') {
        setRecommendedCard('forecast');
      } 
      // Find the highest priority parameter we support
      else if (parameters?.length) {
        const cardToShow = parameters.find(param => cardPriority.includes(param));
        setRecommendedCard(cardToShow || 'general');
      } else {
        setRecommendedCard('general');
      }

    } catch (err) {
      console.error('Error:', err);
      setError(
        err.message || 
        'Sorry, we encountered an error. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderCard = () => {
    if (!weatherData || !recommendedCard) return null;

    const { weather, forecast } = weatherData;

    const cardComponents = {
      humidity: <HumidityCard humidity={weather.humidity} />,
      temp: <TemperatureCard temperature={weather.temperature} feels_like={weather.feels_like} />,
      feels_like: <TemperatureCard temperature={weather.temperature} feels_like={weather.feels_like} />,
      wind: <WindCard speed={weather.wind_speed} direction={weather.wind_deg} gust={weather.wind_gust} />,
      pressure: <PressureCard pressure={weather.pressure} />,
      cloud: <CloudCard cloudiness={weather.cloudiness} />,
      visibility: <VisibilityCard visibility={weather.visibility} />,
      forecast: forecast?.length > 0 ? (
        <ForecastCard forecast={forecast} />
      ) : (
        <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-700 p-4 rounded-lg">
          Forecast data isn't available right now.
        </div>
      ),
      general: <GeneralWeatherCard {...weather} />
    };

    return cardComponents[recommendedCard] || (
      <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-700 p-4 rounded-lg">
        <p>We can't show specialized data for this query. Here's the general weather:</p>
        <GeneralWeatherCard {...weather} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-2 italic ">
            WeatherChatBot
          </h1>
          <p className="text-gray-600 italic">
            Get precise weather information for any location
          </p>
        </header>

        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about weather (e.g., 'humidity in Delhi', 'forecast for Paris')"
              className="flex-grow p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </span>
              ) : 'Get Weather'}
            </button>
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Fetching weather data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-700 p-4 mb-8 rounded-lg">
            <h3 className="font-bold mb-2">We noticed an issue</h3>
            <p>{error}</p>
            <div className="mt-3 text-sm">
              <p>Try queries like:</p>
              <ul className="list-disc list-inside">
                <li>"Temperature in Tokyo"</li>
                <li>"Humidity levels in Dubai"</li>
                <li>"5-day forecast for London"</li>
                <li>"Wind speed in New York"</li>
              </ul>
            </div>
          </div>
        )}

        {/* Weather Card Display */}
        {weatherData && (
          <div className="grid grid-cols-1 gap-6">
            {renderCard()}
          </div>
        )}

        {/* Empty State */}
        {!loading && !weatherData && !error && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <FaCloudSunRain className="text-blue-500 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Ask About Weather</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Get specific weather information by asking about temperature, humidity, 
              wind, or forecasts for any location worldwide.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;