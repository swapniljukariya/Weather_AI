export const fetchWeatherData = async (payload) => {
  const { location, type } = payload;
  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

  const endpoint =
    type === "current"
      ? `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
      : `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(endpoint);
    const data = await response.json();

    if (data.cod !== 200 && data.cod !== "200") {
      throw new Error(data.message || "Failed to fetch weather");
    }

    const weatherSource = type === "forecast" ? data.list?.[0] : data;

    if (!weatherSource || !weatherSource.main || !weatherSource.weather?.[0]) {
      throw new Error("Incomplete weather data");
    }

    return {
      temp: weatherSource.main.temp ?? "N/A",
      feels_like: weatherSource.main.feels_like ?? "N/A",
      pressure: weatherSource.main.pressure ?? "N/A",
      humidity: weatherSource.main.humidity ?? "N/A",
      wind: weatherSource.wind?.speed ?? "N/A",
      clouds: weatherSource.clouds?.all ?? "N/A",
      rain:
        weatherSource.rain?.["1h"] ??
        weatherSource.rain?.["3h"] ??
        (weatherSource.weather[0].main.toLowerCase().includes("rain")
          ? "Expected"
          : 0), // return mm, not string
      weather: {
        main: weatherSource.weather[0].main ?? "N/A",
        description: weatherSource.weather[0].description ?? "N/A",
        icon: weatherSource.weather[0].icon ?? "01d",
      },
    };
  } catch (error) {
    console.error("Weather API error:", error.message);
    return null;
  }
};
