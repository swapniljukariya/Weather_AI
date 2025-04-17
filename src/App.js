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
      // Get structured query from Gemini
      const query = await getWeatherQueryAnalysis(input);
      if (!query || !query.location) throw new Error("Couldn't parse query");

      // Fetch weather from OpenWeather
      const weatherData = await fetchWeatherData(query);

      // Send weatherData to Gemini for interpretation
      const interpretation = await getWeatherInterpretation(weatherData);

      setMessages(prev => [...prev, { from: 'bot', text: interpretation }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { from: 'bot', text: ` Oops! I couldn't understand your question.\n\n💡 Try asking things like:\n- "Should I carry an umbrella tomorrow in Delhi?"\n- "What's the weather like this weekend in Mumbai?"\n- "Will it be windy in Bangalore today?"\n\n🌟 Ask naturally, like you're talking to a friend!` }]);
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
                className={`rounded-lg px-6 py-4 max-w-lg text-sm shadow-lg ${
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
