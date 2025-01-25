import React, { useState } from "react";
import { Search, MapPin, Droplet, Wind, Eye, Thermometer } from "lucide-react";

const weatherIcons: { [key: number]: string } = {
  1000: "☀️", // Clear
  1001: "☁️", // Cloudy
  1100: "🌤️", // Mostly Clear
  2000: "🌫️", // Fog
  4000: "🌧️", // Drizzle
  4001: "🌧️", // Rain
  5000: "❄️", // Snow
  5001: "❄️", // Flurries
};

export default function Weather() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!city.trim()) return;

    setLoading(true);
    setError(null);
    const apiKey = import.meta.env.VITE_API_KEY;

    try {
      const response = await fetch(
        `https://api.tomorrow.io/v4/weather/realtime?location=${city}&apikey=${apiKey}`
      );

      if (!response.ok) {
        throw new Error("Weather data not found");
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError("Could not fetch weather data");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 to-blue-300 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8 space-y-6">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Enter city name"
            className="flex-grow px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="flex items-center justify-center bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? "..." : <Search />}
          </button>
        </div>

        {error && (
          <div className="text-red-500 text-center font-medium">
            {error}
          </div>
        )}

        {weatherData && (
          <div className="space-y-6 text-center">
            <div className="flex justify-center items-center">
              <MapPin className="mr-2 text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-800">
                {weatherData.location.name}
              </h2>
            </div>

            <div className="text-6xl">{weatherIcons[weatherData.data.values.weatherCode] || "🌈"}</div>

            <div className="grid grid-cols-2 gap-4">
              <WeatherStat
                icon={<Thermometer />}
                label="Temperature"
                value={`${weatherData.data.values.temperature.toFixed(1)}°C`}
              />
              <WeatherStat
                icon={<Thermometer />}
                label="Feels Like"
                value={`${weatherData.data.values.temperatureApparent.toFixed(1)}°C`}
              />
              <WeatherStat
                icon={<Droplet />}
                label="Humidity"
                value={`${weatherData.data.values.humidity}%`}
              />
              <WeatherStat
                icon={<Wind />}
                label="Wind"
                value={`${weatherData.data.values.windSpeed.toFixed(1)} m/s`}
              />
              <WeatherStat
                icon={<Eye />}
                label="Visibility"
                value={`${weatherData.data.values.visibility.toFixed(1)} m`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const WeatherStat = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="bg-blue-50 rounded-lg p-4 flex flex-col items-center shadow-md">
    <div className="text-blue-500 text-2xl mb-2">{icon}</div>
    <span className="text-sm text-gray-600 mb-1">{label}</span>
    <span className="font-semibold text-gray-800">{value}</span>
  </div>
);
