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
                  You're an assistant that helps generate structured weather queries.
                  Given a user prompt, return ONLY a JSON object like:
                  
                  {
                    "location": string,
                    "datetime": string (YYYY-MM-DD),
                    "type": "current" | "forecast",
                    "parameters": ["temp", "feels_like", "humidity", "wind", "cloud", "rain", "pressure", "visibility", "sky", "general", "forecast"]
                  }
                  
                  User Prompt:
                  ${query}
                  `
                  .trim(),
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

    if (!rawText) throw new Error("No response text from Gemini");

    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    console.log("Parsed Gemini Payload:", parsed);

    const { location, datetime, type, parameters } = parsed;

    // Handling the case where datetime might be null
    if (!location || !type || !parameters || !Array.isArray(parameters)) {
      throw new Error("Invalid or incomplete payload data");
    }

    // You can also set a default value for datetime if it's missing
    const validDatetime = datetime || new Date().toISOString().split("T")[0]; // Default to today's date

    return {
      ...parsed,
      datetime: validDatetime, // Ensure that datetime is valid
    };
  } catch (error) {
    console.error("Failed to fetch Gemini payload:", error);
    return null;
  }
};
