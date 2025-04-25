// src/components/WeatherMessage.js
export default function WeatherMessage({ data, parameters }) {
    if (!data || parameters.length === 0) return null;
  
    const { rain, temperature, windSpeed, clouds, humidity } = data;
    const paramSet = new Set(parameters.map((p) => p.toLowerCase()));
    const lines = [];
  
    if (paramSet.has("rain")) {
      if (rain > 0) {
        lines.push(`🌧️ Yes, there's a chance of rain. Expected rainfall is ${rain} mm.`);
      } else {
        lines.push("🌤️ No rain expected. The skies should stay clear.");
      }
    }
  
    if (paramSet.has("temperature")) {
      lines.push(`🌡️ The temperature is around ${temperature}°C.`);
    }
  
    if (paramSet.has("wind")) {
      lines.push(`🍃 Winds are blowing at ${windSpeed} m/s.`);
    }
  
    if (paramSet.has("clouds")) {
      lines.push(`☁️ Cloud coverage is around ${clouds}%.`);
    }
  
    if (paramSet.has("humidity")) {
      lines.push(`💧 Humidity level is at ${humidity}%.`);
    }
  
    if (lines.length === 0) {
      lines.push("🤔 I understood your query, but couldn’t find specific weather data for it.");
    }
  
    return (
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-xl text-blue-800 shadow">
        {lines.map((line, index) => (
          <p key={index} className="text-lg mb-1">
            {line}
          </p>
        ))}
      </div>
    );
  }
  