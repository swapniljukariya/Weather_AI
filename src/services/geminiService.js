const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export const getWeatherQueryAnalysis = async (query) => {
  try {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `
You are a weather query parser. Convert the following natural language input to a JSON object:

"${query}"

Return ONLY a valid JSON with this structure:
{
  "location": "city name (string, required)",
  "type": "current or forecast (string, required)",
  "parameters": ["temp", "rain", "wind"], // optional array of strings
  "unit": "metric or imperial (string, default 'metric')"
}

If you're unsure of any value, make a smart guess. DO NOT leave any value empty, null, or blank.
DO NOT include any explanation or extra text.
                  `
                }
              ]
            }
          ]
        })
      }
    );

    const data = await res.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    console.log("🌩️ Gemini raw output:", textResponse);

    const jsonStart = textResponse.indexOf("{");
    const jsonEnd = textResponse.lastIndexOf("}") + 1;
    const jsonString = textResponse.substring(jsonStart, jsonEnd);

    const parsed = JSON.parse(jsonString);

    // 🛑 Check for valid values
    if (!parsed.location || typeof parsed.location !== "string" || parsed.location.trim() === "") {
      throw new Error("❌ Gemini response missing location");
    }

    // ✅ Set default values if needed
    parsed.unit = parsed.unit || "metric";
    parsed.type = parsed.type || "current";
    parsed.parameters = parsed.parameters || ["temp"];

    console.log("✅ Final Parsed:", parsed);
    return parsed;
  } catch (error) {
    console.error("❌ Error analyzing query:", error);
    throw error;
  }
};


export async function getWeatherInterpretation(weatherData) {
  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `
You are a friendly weather assistant. Interpret this weather data for a user in natural language.

✅ Include in your answer (if available):
- Weather condition (like "clear", "cloudy", "rainy", etc.)
- Temperature (in Celsius)
- Humidity
- Wind speed
- Forecast for today or tomorrow if available
- Be brief but informative and sound like a helpful assistant.

Here is the data:
${JSON.stringify(weatherData)}
          `
        }]
      }]
    })
  });

  const data = await response.json();
  console.log('🌦️ Gemini interpretation:', data);

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  return text || 'Sorry, I couldn’t interpret the weather data.';
}

