export const getWeatherQueryAnalysis = async (userQuery) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Extract from weather query: "${userQuery}":
                {
                  "location": "city_name",
                  "date": "today/tomorrow/date",
                  "focus": "rain/temperature/wind/humidity"
                }`
              }]
            }]
          })
        }
      );
  
      const data = await response.json();
      const textResponse = data.candidates[0].content.parts[0].text;
      const jsonMatch = textResponse.match(/{[\s\S]*?}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : {
        location: userQuery,
        date: "today",
        focus: "general"
      };
    } catch (error) {
      console.error("Gemini error:", error);
      return {
        location: userQuery.split(" in ").pop() || "London",
        date: "today",
        focus: "general"
      };
    }
  };