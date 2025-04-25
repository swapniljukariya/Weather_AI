export const fetchWeatherData = async ({ location, type }) => {
  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

  const endpoints = {
    current: `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`,
    forecast: `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`,
  };

  try {
    const response = await fetch(endpoints[type]);
    const data = await response.json();
    console.log("API Response:", data);

    if (data.cod !== 200 && data.cod !== "200") {
      throw new Error(data.message || "Failed to fetch weather");
    }

    // Use the full forecast data if we're querying the forecast
    const weatherSource = type === "forecast" ? data.list : data;

    // Return data for both current weather and forecast
    return {
      main: weatherSource?.main ?? {},
      wind: weatherSource?.wind ?? {},
      clouds: weatherSource?.clouds ?? {},
      visibility: weatherSource?.visibility,
      rain:
        weatherSource?.rain?.["1h"] ??
        weatherSource?.rain?.["3h"] ??
        (weatherSource?.weather?.[0]?.main?.toLowerCase().includes("rain")
          ? "Expected"
          : 0),
      weather: weatherSource?.weather ?? [],
      forecast: type === "forecast" ? aggregateForecastByDay(data.list) : null, // Aggregate forecast data by day
      type, // Include type in response for rendering control
    };
  } catch (error) {
    console.error("Weather API error:", error.message);
    return null;
  }
};

// Function to aggregate forecast data by day
const aggregateForecastByDay = (forecastData) => {
  const dailyForecast = [];

  forecastData.forEach((forecastItem) => {
    const date = new Date(forecastItem.dt * 1000);
    const day = date.toLocaleDateString();

    // Find if the day already exists in the daily forecast array
    const existingDay = dailyForecast.find((item) => item.day === day);

    if (existingDay) {
      existingDay.temps.push(forecastItem.main.temp);
      existingDay.weather.push(forecastItem.weather[0].description);
    } else {
      dailyForecast.push({
        day,
        temps: [forecastItem.main.temp],
        weather: [forecastItem.weather[0].description],
        humidity: forecastItem.main.humidity,
        pressure: forecastItem.main.pressure,
        windSpeed: forecastItem.wind.speed,
        icon: forecastItem.weather[0].icon,
      });
    }
  });

  // For each day, calculate average temperature
  return dailyForecast.map((dayData) => ({
    day: dayData.day,
    avgTemp: (dayData.temps.reduce((sum, temp) => sum + temp, 0) / dayData.temps.length).toFixed(1), // average temp
    weather: dayData.weather[0], // Use first weather condition of the day
    humidity: dayData.humidity,
    pressure: dayData.pressure,
    windSpeed: dayData.windSpeed,
    icon: dayData.icon,
  }));
};
