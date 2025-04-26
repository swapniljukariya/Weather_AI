import React from "react";
import { FaCloudSunRain, FaSun, FaCloud, FaCloudRain, FaWind, FaTemperatureHigh, FaTint, FaCompressAlt, FaEye } from "react-icons/fa";

// Enhanced GeneralWeatherCard with beautiful styling
export const GeneralWeatherCard = ({
  city,
  country,
  weather_main,
  weather_description,
  temperature,
  feels_like,
  temp_min,
  temp_max,
  pressure,
  humidity,
  visibility,
  wind_speed,
  wind_deg,
  wind_gust,
  cloudiness,
  sunrise,
  sunset,
}) => (
  <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl p-8 w-full text-white">
    <div className="flex justify-between items-start mb-6">
      <div>
        <h2 className="text-3xl font-bold mb-1">Weather Overview</h2>
        <p className="text-blue-100">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      <div className="text-right">
        <p className="text-4xl font-bold">{temperature || "N/A"}</p>
        <p className="text-blue-100">{city}, {country}</p>
      </div>
    </div>

    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center">
        <img
          src={`http://openweathermap.org/img/wn/${weather_main === 'Clear' ? '01d' : weather_main === 'Rain' ? '10d' : '03d'}@2x.png`}
          alt={weather_description}
          className="w-20 h-20"
        />
        <div className="ml-4">
          <h3 className="text-2xl font-semibold capitalize">{weather_description || "N/A"}</h3>
          <p className="text-blue-100">Feels like {feels_like || "N/A"}</p>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
        <div className="flex items-center text-blue-100 mb-1">
          <FaTemperatureHigh className="mr-2" />
          <span>Temperature</span>
        </div>
        <div className="flex justify-between">
          <span>High</span>
          <span className="font-semibold">{temp_max || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span>Low</span>
          <span className="font-semibold">{temp_min || "N/A"}</span>
        </div>
      </div>

      <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
        <div className="flex items-center text-blue-100 mb-1">
          <FaTint className="mr-2" />
          <span>Humidity</span>
        </div>
        <div className="flex items-center">
          <span className="text-2xl font-bold mr-2">{humidity || "N/A"}%</span>
        </div>
      </div>

      <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
        <div className="flex items-center text-blue-100 mb-1">
          <FaCompressAlt className="mr-2" />
          <span>Pressure</span>
        </div>
        <span className="text-2xl font-bold">{pressure || "N/A"} hPa</span>
      </div>

      <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
        <div className="flex items-center text-blue-100 mb-1">
          <FaWind className="mr-2" />
          <span>Wind</span>
        </div>
        <span className="text-xl font-bold">{wind_speed || "N/A"} m/s</span>
        {wind_deg && <span className="text-sm block">Direction: {wind_deg}°</span>}
      </div>

      <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
        <div className="flex items-center text-blue-100 mb-1">
          <FaCloud className="mr-2" />
          <span>Clouds</span>
        </div>
        <span className="text-xl font-bold">{cloudiness || "N/A"}%</span>
      </div>

      <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
        <div className="flex items-center text-blue-100 mb-1">
          <FaEye className="mr-2" />
          <span>Visibility</span>
        </div>
        <span className="text-xl font-bold">{visibility || "N/A"} km</span>
      </div>
    </div>

    <div className="mt-6 pt-6 border-t border-white/20 flex justify-between">
      <div className="text-center">
        <p className="text-blue-100">Sunrise</p>
        <p className="text-xl font-semibold">{sunrise || "N/A"}</p>
      </div>
      <div className="text-center">
        <p className="text-blue-100">Sunset</p>
        <p className="text-xl font-semibold">{sunset || "N/A"}</p>
      </div>
    </div>
  </div>
);

// Enhanced TemperatureCard
export const TemperatureCard = ({ temperature, feels_like }) => (
  <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl shadow-2xl p-6 w-full text-white">
    <div className="flex items-center mb-4">
      <FaTemperatureHigh className="text-2xl mr-3" />
      <h2 className="text-2xl font-bold">Temperature</h2>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between items-center bg-white/10 p-3 rounded-lg">
        <span>Current</span>
        <span className="text-xl font-bold">{temperature !== undefined ? `${temperature}°C` : "N/A"}</span>
      </div>
      <div className="flex justify-between items-center bg-white/10 p-3 rounded-lg">
        <span>Feels Like</span>
        <span className="text-xl font-bold">{feels_like !== undefined ? `${feels_like}°C` : "N/A"}</span>
      </div>
    </div>
  </div>
);

// Enhanced HumidityCard
export const HumidityCard = ({ humidity }) => (
  <div className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl shadow-2xl p-6 w-full text-white">
    <div className="flex items-center mb-4">
      <FaTint className="text-2xl mr-3" />
      <h2 className="text-2xl font-bold">Humidity</h2>
    </div>
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-32 h-32 mb-4">
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#ffffff33"
            strokeWidth="3"
            strokeDasharray="100, 100"
          />
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeDasharray={`${humidity || 0}, 100`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold">{humidity !== undefined ? `${humidity}%` : "N/A"}</span>
        </div>
      </div>
      <p className="text-blue-100">Humidity Level</p>
    </div>
  </div>
);

// Enhanced PressureCard
export const PressureCard = ({ pressure }) => (
  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-2xl p-6 w-full text-white">
    <div className="flex items-center mb-4">
      <FaCompressAlt className="text-2xl mr-3" />
      <h2 className="text-2xl font-bold">Pressure</h2>
    </div>
    <div className="flex flex-col items-center">
      <div className="text-5xl font-bold mb-2">{pressure !== undefined ? pressure : "N/A"}</div>
      <div className="text-xl">hPa</div>
      <div className="mt-4 w-full bg-white/20 rounded-full h-2">
        <div 
          className="bg-white h-2 rounded-full" 
          style={{ width: `${pressure ? Math.min(100, (pressure - 950) / 10) : 0}%` }}
        ></div>
      </div>
      <div className="flex justify-between w-full text-xs mt-1">
        <span>950</span>
        <span>1050 hPa</span>
      </div>
    </div>
  </div>
);

// Enhanced WindCard
export const WindCard = ({ speed, gust, direction }) => (
  <div className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl shadow-2xl p-6 w-full text-white">
    <div className="flex items-center mb-6">
      <FaWind className="text-2xl mr-3" />
      <h2 className="text-2xl font-bold">Wind</h2>
    </div>
    <div className="flex items-center justify-between mb-4">
      <div>
        <p className="text-lg">Speed</p>
        <p className="text-3xl font-bold">{speed !== undefined ? `${speed} m/s` : "N/A"}</p>
      </div>
      {direction && (
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-white/30"></div>
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ transform: `rotate(${direction}deg)` }}
          >
            <div className="w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-white"></div>
          </div>
        </div>
      )}
    </div>
    {gust && (
      <div className="bg-white/10 p-3 rounded-lg">
        <p className="text-sm">Gust Speed</p>
        <p className="text-xl font-semibold">{gust} m/s</p>
      </div>
    )}
  </div>
);

// Enhanced CloudCard
export const CloudCard = ({ cloudiness }) => (
  <div className="bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl shadow-2xl p-6 w-full text-white">
    <div className="flex items-center mb-6">
      <FaCloud className="text-2xl mr-3" />
      <h2 className="text-2xl font-bold">Cloud Coverage</h2>
    </div>
    <div className="flex items-center justify-center">
      <div className="relative w-32 h-32">
        <FaCloud className="absolute text-6xl text-white/30" style={{ top: '20%', left: '20%' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold">{cloudiness !== undefined ? `${cloudiness}%` : "N/A"}</span>
        </div>
      </div>
    </div>
  </div>
);

// Enhanced VisibilityCard
export const VisibilityCard = ({ visibility }) => (
  <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl shadow-2xl p-6 w-full text-white">
    <div className="flex items-center mb-6">
      <FaEye className="text-2xl mr-3" />
      <h2 className="text-2xl font-bold">Visibility</h2>
    </div>
    <div className="flex flex-col items-center">
      <div className="text-5xl font-bold mb-2">{visibility !== undefined ? visibility : "N/A"}</div>
      <div className="text-xl">kilometers</div>
      <div className="mt-6 w-full h-3 bg-white/20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-white rounded-full" 
          style={{ width: `${visibility ? Math.min(100, (visibility / 20) * 100) : 0}%` }}
        ></div>
      </div>
      <div className="flex justify-between w-full text-xs mt-1">
        <span>0</span>
        <span>20 km</span>
      </div>
    </div>
  </div>
);

// Enhanced ForecastCard
export const ForecastCard = ({ forecast }) => {
  const dailyForecasts = {};
  forecast?.forEach(item => {
    const date = new Date(item.dt_txt).toLocaleDateString();
    if (!dailyForecasts[date]) {
      dailyForecasts[date] = {
        date,
        temps: [],
        conditions: new Set(),
        items: []
      };
    }
    dailyForecasts[date].temps.push(item.main.temp);
    dailyForecasts[date].conditions.add(item.weather[0].description);
    dailyForecasts[date].items.push(item);
  });

  return (
    <div className="bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl shadow-2xl p-6 w-full text-white">
      <div className="flex items-center mb-6">
        <FaCloudSunRain className="text-2xl mr-3" />
        <h2 className="text-2xl font-bold">5-Day Forecast</h2>
      </div>
      
      {forecast && forecast.length > 0 ? (
        <div className="space-y-4">
          {Object.values(dailyForecasts).slice(0, 5).map((day, index) => {
            const avgTemp = day.temps.reduce((a, b) => a + b, 0) / day.temps.length;
            const conditions = Array.from(day.conditions).join(", ");
            const weatherIcon = day.items[0].weather[0].main;
            
            return (
              <div key={index} className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg">
                    {new Date(day.items[0].dt_txt).toLocaleDateString('en-US', { weekday: 'long' })}
                  </span>
                  <div className="flex items-center">
                    <img
                      src={`http://openweathermap.org/img/wn/${weatherIcon === 'Clear' ? '01d' : weatherIcon === 'Rain' ? '10d' : '03d'}@2x.png`}
                      alt={conditions}
                      className="w-10 h-10"
                    />
                    <span className="text-xl font-bold ml-2">
                      {Math.round(avgTemp)}°C
                    </span>
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-sm text-blue-100">
                  <span className="capitalize">{conditions}</span>
                  <span>
                    <span className="text-red-200">H: {Math.max(...day.temps).toFixed(1)}°C</span> • 
                    <span className="text-blue-200"> L: {Math.min(...day.temps).toFixed(1)}°C</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 bg-white/10 rounded-xl backdrop-blur-sm">
          <p className="text-blue-100">Forecast data not available</p>
        </div>
      )}
    </div>
  );
};