const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export const getWeatherQueryAnalysis = async (query) => {
  try {
    const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{
            text: `You are a weather query parser. Convert the following natural language input to a JSON object:\n"${query}"\nReturn ONLY a valid JSON with this structure: {\n"location": "city name",\n"type": "current or forecast",\n"parameters": ["temp", "rain", "wind"],\n"unit": "metric or imperial"\n}`
          }]
        }]
      })
    });

    const data = await res.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    const jsonStart = textResponse.indexOf("{");
    const jsonEnd = textResponse.lastIndexOf("}") + 1;
    const jsonString = textResponse.substring(jsonStart, jsonEnd);
    const parsed = JSON.parse(jsonString);

    parsed.unit = parsed.unit || "metric";
    parsed.type = parsed.type || "current";
    parsed.parameters = parsed.parameters || ["temp"];

    return parsed;
  } catch (error) {
    console.error("Error analyzing query:", error);
    throw error;
  }
};

export const getWeatherInterpretation = async (weatherData, originalQuery) => {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `
You are a helpful weather assistant. Interpret the following OpenWeatherMap weather data and respond naturally to the user's question.

Original user question:
"${originalQuery}"

Weather data:
${JSON.stringify(weatherData)}
            `
          }]
        }]
      })
    });

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return text || 'Sorry, I couldn’t interpret the weather data.';
  } catch (error) {
    console.error("Error interpreting weather data:", error);
    return 'Sorry, I couldn’t interpret the weather data.';
  }
};
