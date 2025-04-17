export const fetchWeatherData = async (analysis) => {
    try {
      const { location, type = "current", parameters = [], unit = "metric" } = analysis;
  
      if (!location) {
        throw new Error("Location is required");
      }
  
      const endpoint = type === 'forecast' ? 'forecast' : 'weather';
      const url = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${location}&units=${unit}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`;
  
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.statusText}`);
      }
  
      const data = await response.json();
      return formatWeatherData(data, type, parameters);
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
      throw error;
    }
  };
  
  const formatWeatherData = (data, type, parameters) => {
    const isForecast = type === 'forecast';
  
    // Default: Use current data or next forecast data
    const primaryData = isForecast ? data.list?.[0] : data;
  
    const result = {
      location: data.city?.name || data.name,
      coordinates: data.city?.coord || data.coord,
      timestamp: primaryData?.dt ? new Date(primaryData.dt * 1000) : new Date(),
      dailyForecasts: [],
    };
  
    if (isForecast) {
      // Group forecasts by day (e.g., next 3 days)
      const days = {};
      data.list.forEach(entry => {
        const date = new Date(entry.dt * 1000).toLocaleDateString();
        if (!days[date]) {
          days[date] = [];
        }
        days[date].push(entry);
      });
  
      result.dailyForecasts = Object.entries(days).map(([date, entries]) => {
        const temps = entries.map(e => e.main.temp);
        const windSpeeds = entries.map(e => e.wind.speed);
        return {
          date,
          avg_temp: average(temps),
          max_temp: Math.max(...temps),
          min_temp: Math.min(...temps),
          avg_wind: average(windSpeeds),
          condition: entries[0].weather[0].main,
          description: entries[0].weather[0].description,
        };
      });
    }
  
    // Current weather values
    if (primaryData?.main) {
      result.temperature = primaryData.main.temp;
      result.feels_like = primaryData.main.feels_like;
      result.humidity = primaryData.main.humidity;
    }
  
    if (primaryData?.wind) {
      result.wind_speed = primaryData.wind.speed;
      result.wind_direction = primaryData.wind.deg;
    }
  
    if (primaryData?.weather?.[0]) {
      result.condition = primaryData.weather[0].main;
      result.description = primaryData.weather[0].description;
      result.icon = primaryData.weather[0].icon;
    }
  
    return result;
  };
  
  const average = arr => (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1);
  