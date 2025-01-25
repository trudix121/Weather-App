import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, MapPin, Droplet, Wind, Eye, Thermometer, Cloud, Sun, 
  CloudRain, CloudSnow, Cloud as CloudIcon, CloudFog 
} from "lucide-react";

const weatherIcons = {
  "1000": { icon: <Sun color="#FFD700" size={64} />, description: "Clear, Sunny" },
  "1001": { icon: <Cloud color="gray" size={64} />, description: "Cloudy" },
  "1101": { icon: <CloudIcon color="lightgray" size={64} />, description: "Partly Cloudy" },
  "2000": { icon: <CloudFog color="gray" size={64} />, description: "Fog" },
  "4000": { icon: <CloudRain color="blue" size={64} />, description: "Drizzle" },
  "5000": { icon: <CloudSnow color="white" size={64} />, description: "Snow" },
  "8000": { icon: <CloudIcon color="darkgray" stroke="yellow" size={64} />, description: "Thunderstorm" }
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

  const getWeatherDisplay = (weatherCode: string) => {
    return weatherIcons[weatherCode] || {
      icon: <CloudIcon size={64} />,
      description: "Unknown Weather"
    };
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-cyan-100 to-blue-300 flex items-center justify-center p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="bg-white shadow-xl rounded-2xl w-full max-w-md p-6 sm:p-8 space-y-4 sm:space-y-6"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 60 }}
      >
        <motion.div
          className="flex items-center space-x-2 sm:space-x-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Enter city name"
            className="flex-grow px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            whileFocus={{ scale: 1.05 }}
          />
          <motion.button
            onClick={handleSearch}
            disabled={loading}
            className="flex items-center justify-center bg-blue-500 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {loading ? "..." : <Search size={16} />}
          </motion.button>
        </motion.div>

        {error && (
          <motion.div
            className="text-red-500 text-center text-sm font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {error}
          </motion.div>
        )}

        {weatherData && (
          <motion.div
            className="space-y-4 sm:space-y-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.div className="flex justify-center items-center">
              <MapPin className="mr-1 sm:mr-2 text-blue-500" size={20} />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                {weatherData.location.name}
              </h2>
            </motion.div>

            <motion.div
              className="text-5xl sm:text-7xl flex justify-center items-center"
              animate={{ scale: [0.9, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {getWeatherDisplay(weatherData.data.values.weatherCode).icon}
            </motion.div>

            <p className="text-gray-600 text-sm sm:text-base font-medium">
              {getWeatherDisplay(weatherData.data.values.weatherCode).description}
            </p>

            <motion.div
              className="grid grid-cols-3 gap-2 sm:grid-cols-2 sm:gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {[
                { 
                  icon: <Thermometer />, 
                  label: "Temp", 
                  value: `${weatherData.data.values.temperature.toFixed(1)}°C`,
                  color: "text-orange-500" 
                },
                { 
                  icon: <Thermometer />, 
                  label: "Feels Like", 
                  value: `${weatherData.data.values.temperatureApparent.toFixed(1)}°C`,
                  color: "text-yellow-500"
                },
                { 
                  icon: <Droplet />, 
                  label: "Humidity", 
                  value: `${weatherData.data.values.humidity}%`,
                  color: "text-blue-500"
                },
                { 
                  icon: <Wind />, 
                  label: "Wind", 
                  value: `${weatherData.data.values.windSpeed.toFixed(1)} m/s`,
                  color: "text-green-500"
                },
                { 
                  icon: <Eye />, 
                  label: "Visibility", 
                  value: `${weatherData.data.values.visibility.toFixed(1)} m`,
                  color: "text-purple-500"
                },
                { 
                  icon: <Cloud />, 
                  label: "Cloud Cover", 
                  value: `${weatherData.data.values.cloudCover}%`,
                  color: "text-gray-500"
                }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-blue-50 rounded-lg p-2 sm:p-4 flex flex-col items-center shadow-md"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className={`${stat.color} text-xl sm:text-2xl mb-1`}>{stat.icon}</div>
                  <span className="text-xs sm:text-sm text-gray-600 mb-0.5">{stat.label}</span>
                  <span className="font-semibold text-gray-800 text-xs sm:text-base">{stat.value}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
