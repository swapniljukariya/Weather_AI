import React, { useState } from 'react';
import {
  getWeatherQueryAnalysis,
  getWeatherInterpretation
} from './services/geminiService';
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

      let reply = '';

      // If the query is for a forecast
      if (query.type === 'forecast') {
        if (weatherData.dailyForecasts?.length > 0) {
          reply = `📅 Here's the forecast for ${query.location}:\n`;
          weatherData.dailyForecasts.forEach((day) => {
            reply += `\n🗓️ ${day.date} - ${day.condition} (${day.description})\n🌡️ ${day.min_temp}°C - ${day.max_temp}°C\n💨 Avg wind: ${day.avg_wind} m/s\n`;
          });
        } else {
          reply = `Sorry, I couldn't find the forecast for ${query.location}.`;
        }
      } else {
        // Otherwise, use Gemini to interpret the weather in friendly text
        reply = await getWeatherInterpretation(weatherData);
      }

      setMessages(prev => [...prev, { from: 'bot', text: reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        from: 'bot',
        text: `Oops! I couldn't understand your question.\n\n💡 Try asking things like:\n- "What's the temperature in Delhi?"\n- "Will it rain in Mumbai tomorrow?"\n- "Show me the 5-day forecast for Bangalore."`
      }]);
    }

    setInput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white p-6">
      <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">AskWeather 🌤️</h1>
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg p-8">
        <div className="space-y-4 h-[600px] overflow-y-auto mb-4 border p-6 rounded-xl bg-gray-50 shadow-inner">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`rounded-lg px-6 py-4 max-w-lg text-sm shadow-lg whitespace-pre-wrap ${
                  msg.from === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-6">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the weather..."
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
          />
          <button
            onClick={handleAsk}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 text-lg"
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
