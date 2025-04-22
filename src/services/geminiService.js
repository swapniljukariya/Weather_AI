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
Given a natural language prompt from the user, return ONLY a JSON object with this format:

{
  "location": string,
  "datetime": string (YYYY-MM-DD),
  "type": "current" | "forecast",
  "parameters": ["temp", "rain", "wind", "clouds", "humidity"]
}

User Prompt:
${query}
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
    if (!rawText) throw new Error("No response text from Gemini");

    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    console.log("Parsed Gemini Payload:", parsed);
    return parsed;
  } catch (error) {
    console.error("Failed to fetch Gemini payload:", error);
    return null;
  }
};
