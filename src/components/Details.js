import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './Details.css';

function Details() {
  const { city } = useParams();
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [hourlyForecastData, setHourlyForecastData] = useState(null);

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

      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
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

  const createHourlyTemperatureChart = () => {
    const options = {
      chart: {
        type: 'line',
      },
      title: {
        text: 'Hourly Temperature Variations',
      },
      xAxis: {
        categories: hourlyForecastData.map((forecast) => new Date(forecast.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
        title: {
          text: 'Time',
        },
      },
      yAxis: {
        title: {
          text: 'Temperature (°C)',
        },
      },
      series: [
        {
          name: 'Temperature',
          data: hourlyForecastData.map((forecast) => forecast.main.temp),
        },
      ],
    };

    return options;
  };

  useEffect(() => {
    // Load hourly forecast data when 5-day forecast data is available
    if (forecastData && forecastData.list) {
      const firstDayHourlyData = forecastData.list.slice(0, 8); // Adjust the number of hours as needed
      setHourlyForecastData(firstDayHourlyData);
    }
  }, [forecastData]);
  

  const createTemperatureChart = () => {
    const options = {
      chart: {
        type: 'line',
      },
      title: {
        text: 'Temperature Trends',
      },
      xAxis: {
        categories: forecastData.list.map((forecast) => new Date(forecast.dt * 1000).toLocaleDateString()),
        title: {
          text: 'Date',
        },
      },
      yAxis: {
        title: {
          text: 'Temperature (°C)',
        },
      },
      series: [
        {
          name: 'Max Temperature',
          data: forecastData.list.map((forecast) => forecast.main.temp_max),
        },
        {
          name: 'Min Temperature',
          data: forecastData.list.map((forecast) => forecast.main.temp_min),
        },
      ],
    };

    return options;
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

  const chartStyle = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    margin: '20px',
    color: '#044',
  };

  return (
    <div className="center-container">
      {weatherData ? (
        <div>
          {/* Display current weather information */}
          <h2 className='had'>{weatherData.location.name}, {weatherData.location.country}</h2>
          {/* Add other current weather details here */}

          {forecastData ? (
            <div>
              {/* HighchartsReact component to render the chart */}
              <div style={chartStyle}>
                <HighchartsReact highcharts={Highcharts} options={createTemperatureChart()} />
              </div>
              <h3 className='had'>5-Day Forecast</h3>
              <ul className='unordered'>
                {forecastData.list.map((forecast) => (
                  <li className='list' key={forecast.dt}>
                    {/* Display forecast details, e.g., date, weather icon, high and low temperatures */}
                    {new Date(forecast.dt * 1000).toLocaleDateString()}
                    <img
                      className='image2'
                      src={`https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`}
                      alt={forecast.weather[0].description}
                    />
                    {forecast.weather[0].description}<br />
                    H: {forecast.main.temp_max}° <br /> L: {forecast.main.temp_min}°
                  </li>
                ))}
              </ul>
              {hourlyForecastData ? (
            <div>
              {/* HighchartsReact component to render the hourly temperature chart */}
              <div style={chartStyle}>
                <HighchartsReact highcharts={Highcharts} options={createHourlyTemperatureChart()} />
              </div>
            </div>
          ) : (
            <div className="loading-spinner"></div>
          )}
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
