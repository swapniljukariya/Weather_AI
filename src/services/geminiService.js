const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

export async function getWeatherQueryAnalysis(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const systemPrompt = `Extract the location, type (current or forecast), parameters (e.g. temp, humidity, wind), and unit (metric or imperial) from this weather query: "${prompt}". Respond ONLY in this JSON format:
{
  "location": "string",
  "type": "current" or "forecast",
  "parameters": ["temp", "humidity"],
  "unit": "metric" or "imperial"
}`;

  const body = {
    contents: [
      {
        role: 'user',
        parts: [{ text: systemPrompt }],
      },
    ],
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const result = await response.json();

  if (!result?.candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error('Gemini API returned no response');
  }

  const text = result.candidates[0].content.parts[0].text;

  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');
  const jsonString = text.slice(jsonStart, jsonEnd + 1);
  const parsed = JSON.parse(jsonString);

  console.log('✅ Gemini raw output:', text);
  return parsed;
}
