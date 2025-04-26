// Function to fetch data from Gemini API
export const getGeminiPayload = async (query) => {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `
  You're an assistant that extracts structured weather queries.
  Return JSON like:
  {
    "location": string,
    "datetime": string (YYYY-MM-DD),
    "type": "current" | "forecast",
    "parameters": ["temp", "feels_like", "humidity", "wind", "cloud", "rain", "pressure", "visibility", "sky", "general", "forecast"]
  }
  User Prompt: ${query}
                    `.trim(),
                  },
                ],
                role: "user",
              },
            ],
          }),
        }
      );
  
      const json = await res.json();
      const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) return null;
  
      const cleaned = rawText.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
  
      if (!parsed.datetime) {
        parsed.datetime = new Date().toISOString().split("T")[0];
      }
  
      return parsed;
    } catch (error) {
      console.error("Gemini Error:", error);
      return null;
    }
  };
  
  // Function to fetch weather data from OpenWeather API
  export const fetchWeatherData = async (location, parameters) => {
    try {
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
      const baseUrl = "https://api.openweathermap.org/data/2.5/weather";
      const url = `${baseUrl}?q=${location}&appid=${apiKey}&units=metric`;
  
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.cod !== 200) {
        throw new Error("Error fetching weather data");
      }
  
      const weatherData = {};
  
      if (parameters.includes("temp")) weatherData.temp = data.main.temp;
      if (parameters.includes("feels_like")) weatherData.feels_like = data.main.feels_like;
      if (parameters.includes("humidity")) weatherData.humidity = data.main.humidity;
      if (parameters.includes("wind")) weatherData.wind = data.wind.speed;
      if (parameters.includes("cloud")) weatherData.cloud = data.clouds.all;
      if (parameters.includes("rain")) weatherData.rain = data.rain?.["1h"] || 0;
      if (parameters.includes("pressure")) weatherData.pressure = data.main.pressure;
      if (parameters.includes("visibility")) weatherData.visibility = data.visibility;
      if (parameters.includes("sky")) weatherData.sky = data.weather[0].description;
      if (parameters.includes("general")) weatherData.general = data.weather[0].main;
  
      return weatherData;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      return null;
    }
  };
  