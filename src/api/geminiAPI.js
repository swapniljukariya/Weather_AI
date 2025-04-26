export const getGeminiPayload = async (query) => {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`;
      const body = {
        contents: [
          {
            parts: [
              {
                text: `
                  You're an assistant that extracts structured weather queries with these rules:
                  1. If the user asks about future weather or forecast, ALWAYS set type="forecast"
                  2. Parameters should ONLY include the most specific weather aspects requested
                  3. "forecast" parameter should ONLY be included when explicitly requested
                  4. "general" should ONLY be included for broad weather queries
                  
                  Return JSON like:
                  {
                    "location": string (required),
                    "datetime": string (YYYY-MM-DD),
                    "type": "current" | "forecast",
                    "parameters": ["temp", "feels_like", "humidity", "wind", 
                                 "cloud", "rain", "pressure", "visibility", 
                                 "sky", "general", "forecast"]
                  }
                  
                  Examples:
                  - "Will it rain tomorrow in Paris?" → 
                    {location: "Paris", type: "forecast", parameters: ["rain"]}
                  - "Weather forecast for Delhi" → 
                    {location: "Delhi", type: "forecast", parameters: ["forecast"]}
                  - "What's the temperature in Tokyo?" → 
                    {location: "Tokyo", type: "current", parameters: ["temp"]}
                  
                  Current User Prompt: "${query}"
                `.trim(),
              },
            ],
            role: "user",
          },
        ],
      };
  
      console.log("Sending to Gemini:", body);

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
  
      const json = await res.json();
      console.log("Raw Gemini response:", json);

      const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        console.error("Error: No response from Gemini API");
        return null;
      }
  
      console.log("Gemini text response:", rawText);

      const cleaned = rawText.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
  
      if (!parsed.datetime) {
        parsed.datetime = new Date().toISOString().split("T")[0];
      }
  
      console.log("Parsed Gemini response:", parsed);
      return parsed;
    } catch (error) {
      console.error("Gemini Error:", error);
      return null;
    }
  };