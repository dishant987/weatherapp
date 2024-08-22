import React, { Suspense, useState } from 'react';
import axios from 'axios';
const SearchInput = React.lazy(() => import('./components/SearchInput'));
import { motion, AnimatePresence } from 'framer-motion';
import { FaSun, FaMoon, FaLaptop } from 'react-icons/fa';
import './App.css';
import { useTheme } from './context/ThemeContext';
import SkeletonLoader from './components/SkeletonLoader';



function App() {
  const [currentData, setCurrentData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null); // State to manage selected day
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);

  const handleCitySelect = async (city) => {
    try {
      setLoading(true);
      // Fetch current weather data
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${import.meta.env.VITE_API_KEY}`
      );
      setCurrentData(weatherResponse.data);

      // Fetch 7-day forecast data
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&cnt=40&appid=${import.meta.env.VITE_API_KEY}`
      );
      setForecastData(forecastResponse.data);
    } catch (error) {
      console.error('Error fetching weather or forecast data:', error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  // Function to get weekday from timestamp
  const getWeekday = (timestamp) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(timestamp * 1000); // Convert from seconds to milliseconds
    return daysOfWeek[date.getDay()];
  };

  // Convert temperature from Kelvin to Celsius
  const kelvinToCelsius = (temp) => {
    return temp - 273.15;
  };

  // Aggregate forecast data by day
  const getDailyForecasts = () => {
    if (!forecastData) return [];

    const dailyForecasts = {};
    forecastData.list.forEach((entry) => {
      const date = new Date(entry.dt * 1000).toDateString();
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = {
          minTemp: kelvinToCelsius(entry.main.temp),
          maxTemp: kelvinToCelsius(entry.main.temp),
          description: entry.weather[0].description,
          icon: entry.weather[0].icon,
          pressure: entry.main.pressure,
          clouds: entry.clouds.all,
          seaLevel: entry.main.sea_level,
          humidity: entry.main.humidity,
          windSpeed: entry.wind.speed,
          feelsLike: kelvinToCelsius(entry.main.feels_like),
        };
      } else {
        const tempInCelsius = kelvinToCelsius(entry.main.temp);
        dailyForecasts[date].minTemp = Math.min(dailyForecasts[date].minTemp, tempInCelsius);
        dailyForecasts[date].maxTemp = Math.max(dailyForecasts[date].maxTemp, tempInCelsius);
      }
    });

    return Object.keys(dailyForecasts).map((date) => ({
      weekday: getWeekday(new Date(date).getTime() / 1000),
      ...dailyForecasts[date],
    }));
  };



  return (
    <div className={`min-h-screen flex flex-col bg-gray-100 dark:bg-gray-800 p-4 transition-colors duration-300 ${theme}`}>
      <div className="flex justify-between mb-4 items-center">
        {/* Theme Toggle Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={() => toggleTheme('light')}
            className={`p-2 rounded ${theme === 'light' ? 'bg-gray-200 dark:bg-gray-700' : 'bg-gray-300 dark:bg-gray-600'} transition duration-300`}
            title="Light Mode"
          >
            <FaSun className={`text-lg ${theme === 'light' ? 'text-yellow-500' : 'text-gray-500'} dark:text-gray-200`} />
          </button>
          <button
            onClick={() => toggleTheme('dark')}
            className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-200 dark:bg-gray-700' : 'bg-gray-300 dark:bg-gray-600'} transition duration-300`}
            title="Dark Mode"
          >
            <FaMoon className={`text-lg ${theme === 'dark' ? 'text-gray-800' : 'text-gray-500'} dark:text-gray-200`} />
          </button>
          <button
            onClick={() => toggleTheme('system')}
            className={`p-2 rounded ${theme === 'system' ? 'bg-gray-200 dark:bg-gray-700' : 'bg-gray-300 dark:bg-gray-600'} transition duration-300`}
            title="System Mode"
          >
            <FaLaptop className={`text-lg ${theme === 'system' ? 'text-gray-600' : 'text-gray-500'} dark:text-gray-200`} />
          </button>
        </div>
      </div>

      <div className="flex flex-col bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-3xl mx-auto transition-colors duration-300">
        <Suspense fallback={
          <motion.div
            className="w-full p-2 border rounded pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300
                       dark:bg-gray-800 dark:border-gray-600"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.5 }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
          </motion.div>
        }>
          <SearchInput onSelectCity={handleCitySelect} />
        </Suspense>
        {loading ? (
          <SkeletonLoader />
        ) :
          (currentData && (
            <motion.div
              className="mt-6"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5 }}
            >
              {/* Current weather section */}
              <div className="font-bold text-2xl text-center mb-2 text-gray-900 dark:text-gray-100">{currentData.name}</div>
              <div className="text-md text-gray-600 dark:text-gray-400 text-center mb-4">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
              <motion.div
                className="flex items-center justify-between text-center mb-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Weather Icon */}
                <div className="flex-shrink-0">
                  <motion.img
                    src={`http://openweathermap.org/img/wn/${currentData.weather[0].icon}@4x.png`}
                    alt={currentData.weather[0].description}
                    className="w-32 h-32 mx-auto"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                {/* Weather Details */}
                <div className="flex-1 flex flex-col items-center justify-center mx-4">
                  <div className="font-medium text-5xl mb-2 text-gray-900 dark:text-gray-100">{Math.round(currentData.main.temp)}°C</div>
                  <div className="text-md text-gray-600 dark:text-gray-400 mb-2">{currentData.weather[0].description}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    High: {Math.round(currentData.main.temp_max)}°C | Low: {Math.round(currentData.main.temp_min)}°C
                  </div>
                </div>

                {/* Additional Information */}
                <div className="flex flex-col gap-2 items-start text-gray-900 dark:text-gray-100">
                  <div className="flex items-center">
                    <div className="font-medium text-sm mr-2">Wind:</div>
                    <div>{currentData.wind.speed} m/s</div>
                  </div>
                  <div className="flex items-center">
                    <div className="font-medium text-sm mr-2">Humidity:</div>
                    <div>{currentData.main.humidity}%</div>
                  </div>
                  <div className="flex items-center">
                    <div className="font-medium text-sm mr-2">Visibility:</div>
                    <div>{currentData.visibility / 1000} km</div>
                  </div>
                </div>
              </motion.div>

              {/* Weekdays and Forecast Section */}
              <div className="mt-6">
                <div className="font-medium text-xl mb-4 text-center text-gray-900 dark:text-gray-100">7-Day Forecast</div>
                <div className="flex flex-col gap-4">
                  <AnimatePresence>
                    {getDailyForecasts().map((forecast, index) => (
                      <motion.div
                        key={index}
                        className="bg-blue-100 p-1  rounded-lg  shadow-md"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                      >
                        <button
                          className="flex items-center justify-between w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg duration-300 hover:bg-blue-100 dark:hover:bg-blue-700 transition"
                          onClick={() => setSelectedDay(selectedDay === index ? null : index)}
                        >
                          <div className="font-medium text-lg flex-1 text-center text-gray-900 dark:text-gray-100">{forecast.weekday}</div>
                          <img
                            src={`http://openweathermap.org/img/wn/${forecast.icon}@2x.png`}
                            alt={forecast.description}
                            className="w-20 h-20"
                          />
                          <div className="flex-1 text-center text-gray-700 dark:text-gray-300 font-medium text-lg">{forecast.description}</div>
                          <div className="flex-1 text-center text-gray-600 dark:text-gray-400">{Math.round(forecast.maxTemp)}°C/{Math.round(forecast.minTemp)}°C</div>
                        </button>
                        {selectedDay === index && (
                          <motion.div
                            className="mt-4 bg-white dark:bg-gray-900 p-3 rounded-lg shadow-md"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="flex flex-wrap gap-4">
                              <div className="flex-1 min-w-[150px] text-left text-sm text-gray-600 dark:text-gray-300">
                                <div>Pressure: {forecast.pressure} hPa</div>
                                <div>Clouds: {forecast.clouds}%</div>
                                <div>Sea Level: {forecast.seaLevel} m</div>
                              </div>
                              <div className="flex-1 min-w-[150px] text-left text-sm text-gray-600 dark:text-gray-300">
                                <div>Humidity: {forecast.humidity}%</div>
                                <div>Wind Speed: {forecast.windSpeed} m/s</div>
                                <div>Feels Like: {Math.round(forecast.feelsLike)}°C</div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))
        }
      </div>
    </div>
  );
}

export default App;
