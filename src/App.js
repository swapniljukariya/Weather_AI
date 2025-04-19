import React, { useState } from 'react';
import { getWeatherQueryAnalysis, getWeatherInterpretation } from './services/geminiService';
import { fetchWeatherData } from './services/weatherService';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleAsk = async () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { from: 'user', text: input }]);

    try {
      const query = await getWeatherQueryAnalysis(input);

      if (!query || !query.location) throw new Error("Couldn't parse query");

      const weatherData = await fetchWeatherData(query);
      const interpretation = await getWeatherInterpretation(weatherData, input);

      let rainAdvice = '';
      if (query.type === 'forecast' && weatherData.dailyForecasts?.length > 0) {
        const willRain = weatherData.dailyForecasts.some(day =>
          day.description.toLowerCase().includes('rain')
        );

        rainAdvice = willRain
          ? `🌧️ Yes, it's expected to rain in ${query.location}. You might want to carry an umbrella!`
          : `🌞 No rain expected in ${query.location}, no need for an umbrella today.`;
      }

      const replyElement = (
        <div className="flex flex-col w-full">
          <div className="bg-white/30 backdrop-blur-md border border-white/40 shadow-xl rounded-3xl p-8 w-full text-gray-900">
            <h2 className="text-2xl font-bold mb-4">🤖 Gemini AI says:</h2>
            <p className="text-base whitespace-pre-wrap mb-4">{interpretation}</p>

            {rainAdvice && (
              <p className="bg-yellow-100 text-yellow-800 rounded-xl p-3 font-semibold mb-4">
                {rainAdvice}
              </p>
            )}

            {query.type === 'forecast' && weatherData.dailyForecasts?.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">📅 7-Day Forecast</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {weatherData.dailyForecasts.map((day, idx) => (
                    <div
                      key={idx}
                      className="bg-white/60 rounded-xl p-4 shadow-md border border-gray-200"
                    >
                      <h3 className="font-bold text-lg">{day.date}</h3>
                      <p>{day.condition} - {day.description}</p>
                      <p>🌡️ {day.min_temp}°C - {day.max_temp}°C</p>
                      <p>💨 Wind: {day.avg_wind} m/s</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {query.type === 'current' && weatherData.current && (
              <div className="bg-white/50 rounded-xl p-4 mt-6 shadow border border-gray-300">
                <h3 className="text-xl font-semibold text-blue-800 mb-2">📍 Current Weather in {query.location}</h3>
                <p>🌡️ <strong>Temperature:</strong> {weatherData.current.temp}°C (Feels like {weatherData.current.feels_like}°C)</p>
                <p>💧 <strong>Humidity:</strong> {weatherData.current.humidity}%</p>
                <p>💨 <strong>Wind:</strong> {weatherData.current.wind_speed} m/s</p>
                <p>☁️ <strong>Conditions:</strong> {weatherData.current.description}</p>
              </div>
            )}
          </div>
        </div>
      );

      setMessages(prev => [...prev, { from: 'bot', element: replyElement }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          from: 'bot',
          text: `😕 Oops! I couldn't understand your question.\n\n💡 Try asking things like:\n- "What's the temperature in Delhi?"\n- "Will it rain in Mumbai tomorrow?"\n- "Show me the 5-day forecast for Bangalore."`
        }
      ]);
    }

    setInput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-white to-blue-100 p-4">
      <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">AskWeather 🌤️</h1>
      <div className="max-w-5xl mx-auto">
        <div className="space-y-6 overflow-y-auto mb-8">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`w-full flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`w-full md:w-[90%] rounded-3xl px-6 py-4 shadow-xl ${
                  msg.from === 'user'
                    ? 'bg-blue-600 text-white text-right'
                    : 'bg-white/50 text-gray-800'
                }`}
              >
                {msg.text}
                {msg.element && <div>{msg.element}</div>}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the weather..."
            className="flex-1 px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg shadow-sm"
          />
          <button
            onClick={handleAsk}
            className="px-6 py-4 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition duration-300 shadow-lg text-lg"
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
