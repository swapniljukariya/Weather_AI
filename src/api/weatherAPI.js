export const fetchWeatherData = async (location) => {
    try {
      console.log("Fetching weather data for:", location);
  
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
  
      const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`);
      const weatherData = await weatherResponse.json();
  
      const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`);
      const forecastData = await forecastResponse.json();
  
      console.log("Weather API response:", weatherData);
      console.log("Forecast API response:", forecastData);
  
      if (weatherResponse.ok && forecastResponse.ok) {
        const formatTime = (timestamp) => {
          if (!timestamp) return "N/A";
          const date = new Date(timestamp * 1000);
          return date.toLocaleTimeString();
        };
  
        const weatherMappedData = {
          city: weatherData.name || "N/A",
          country: weatherData.sys?.country || "N/A",
          weather_main: weatherData.weather[0]?.main || "N/A",
          weather_description: weatherData.weather[0]?.description || "N/A",
          temperature: weatherData.main?.temp !== undefined ? `${weatherData.main.temp} °C` : "N/A",
          feels_like: weatherData.main?.feels_like !== undefined ? `${weatherData.main.feels_like} °C` : "N/A",
          humidity: weatherData.main?.humidity !== undefined ? `${weatherData.main.humidity} %` : "N/A",
          pressure: weatherData.main?.pressure !== undefined ? `${weatherData.main.pressure} hPa` : "N/A",
          wind_speed: weatherData.wind?.speed !== undefined ? `${weatherData.wind.speed} m/s` : "N/A",
          cloudiness: weatherData.clouds?.all !== undefined ? `${weatherData.clouds.all} %` : "N/A",
          visibility: weatherData.visibility !== undefined ? `${(weatherData.visibility / 1000).toFixed(1)} km` : "N/A",
          sunrise: formatTime(weatherData.sys?.sunrise),
          sunset: formatTime(weatherData.sys?.sunset),
        };
  
        const forecastList = forecastData.list || [];
  
        console.log("Mapped Weather Data:", weatherMappedData);
        console.log("Mapped Forecast Data:", forecastList);
  
        return {
          weather: weatherMappedData,
          forecast: forecastList,
        };
      } else {
        console.error("Weather or Forecast API Error:", weatherData, forecastData);
        return null;
      }
    } catch (error) {
      console.error("Weather API Fetch Error:", error);
      return null;
    }
  };
  