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