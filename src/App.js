import React, { useState } from 'react';
import { getWeatherQueryAnalysis } from './services/geminiService';
import { fetchWeatherData } from './services/weatherService';

const App = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleAsk = async () => {
    if (!query) return; // Prevent sending empty query

    const userMessage = { text: query, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setQuery('');

    try {
      setError(null);
      setResponse(null);
      setIsTyping(true);

      const analysis = await getWeatherQueryAnalysis(query);
      const weather = await fetchWeatherData(analysis);
      setIsTyping(false);

      const botMessage = {
        text: formatWeatherResponse(weather),
        sender: 'bot',
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      setIsTyping(false);
      setError("Something went wrong. Please try again.");
    }
  };

  const formatWeatherResponse = (weather) => {
    if (!weather) return 'Could not fetch weather data.';
    
    return `
      Weather in ${weather.location}:
      🌡️ Temp: ${weather.temperature}°C (Feels like ${weather.feels_like}°C)
      💧 Humidity: ${weather.humidity}%
      💨 Wind: ${weather.wind_speed} m/s
      🌤️ Condition: ${weather.description}
    `;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-200">
      <div className="bg-gray-800 shadow-xl rounded-lg p-12 w-full sm:w-3/4 lg:w-1/2 xl:w-1/2 max-w-7xl">
        <h1 className="text-4xl font-extrabold text-center text-white mb-8">WeatherBot</h1>

        <div className="bg-gray-700 p-8 rounded-lg shadow-inner max-h-96 overflow-y-auto mb-8">
          <div className="space-y-6">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-6 rounded-lg max-w-3xl ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-100'}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="p-6 rounded-lg max-w-xs bg-gray-600 text-gray-100 italic">
                  Typing...
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-6 rounded-lg border-2 border-gray-600 bg-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Ask about the weather..."
          />
        </div>

        <button
          onClick={handleAsk}
          className="w-full bg-blue-600 text-white py-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Ask
        </button>

        {error && <div className="text-red-500 mt-6 text-center">{error}</div>}
      </div>
    </div>
  );
};

export default App;
