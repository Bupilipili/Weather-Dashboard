

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Details.css';

function Details() {
  const { city } = useParams();
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);

  const loadWeatherData = async (cityName) => {
    try {
      // Replace this with your actual API key
      const apiKey = '786177d666c24f5f86d121735230609';

      const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityName}`);
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadForecastData = async (lat, lon) => {
    try {
      // Replace this with your actual API key
      const apiKey = 'd1104dacc12792ce13054f5f24e4bfa9';

      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`);
      const data = await response.json();

      // Filter out duplicate dates
      const uniqueDates = [];
      const filteredForecast = data.list.filter((forecast) => {
        const date = new Date(forecast.dt * 1000).toLocaleDateString();
        if (!uniqueDates.includes(date)) {
          uniqueDates.push(date);
          return true;
        }
        return false;
      });

      setForecastData({ ...data, list: filteredForecast });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Load weather data for the selected city when the component mounts
    loadWeatherData(city);
  }, [city]);

  useEffect(() => {
    // Load 5-day forecast data when weather data is available
    if (weatherData && weatherData.location) {
      const { lat, lon } = weatherData.location;
      loadForecastData(lat, lon);
    }
  }, [weatherData]);

  return (
    <div className="center-container">
      {weatherData ? (
        <div>
          {/* Display current weather information */}
          <h2>{weatherData.location.name}, {weatherData.location.country}</h2>
          {/* Add other current weather details here */}

          {forecastData ? (
            <div>
              <h3>5-Day Forecast</h3>
              <ul>
                {forecastData.list.map((forecast) => (
                  <li key={forecast.dt}>
                    {/* Display forecast details, e.g., date, weather icon, high and low temperatures */}
                    {new Date(forecast.dt * 1000).toLocaleDateString()}: 
                    <img
                      src={`https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`}
                      alt={forecast.weather[0].description}
                    />
                    {forecast.weather[0].description}
                    High: {forecast.main.temp_max}, Low: {forecast.main.temp_min}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="loading-spinner"></div>
          )}
        </div>
      ) : (
        <div className="loading-spinner"></div>
      )}
    </div>
  );
}

export default Details;
