const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export async function getWeatherQueryAnalysis(prompt) {
  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `
Given the user's query, extract:
- location (city)
- type (current/forecast)
- parameters (like temperature, humidity, rain etc.)

Respond **only in valid JSON format** like:
{
  "location": "Delhi",
  "type": "current",
  "parameters": ["temperature", "humidity"]
}

User Query: "${prompt}"
`
        }]
      }]
    })
  });

  const data = await response.json();
  console.log('🧠 Gemini raw response:', data);

  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  try {
    // Check for code block style ```json ... ```
    const cleanedText = rawText?.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (err) {
    console.error('Failed to parse Gemini JSON:', rawText);
    throw new Error('Gemini response not in valid JSON');
  }
}

export async function getWeatherInterpretation(weatherData) {
  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `Interpret this weather data for a user in friendly, natural language:\n${JSON.stringify(weatherData)}`
        }]
      }]
    })
  });

  const data = await response.json();
  console.log('🔍 Gemini interpretation response:', data);

  const interpretation = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  return interpretation || 'Could not interpret weather data.';
}
