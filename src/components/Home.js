import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'; // Import axios for making HTTP requests
import fetchWeatherByCityName from '../services/api';
import './Home.css';

// Function to fetch the city name based on latitude and longitude using OpenCage Geocoding API
const fetchCityNameByCoordinates = async (latitude, longitude) => {
  const apiKey = '4a0a7c3f2096409eb53cc6d27fc91d36'; // Replace with your actual API key
  const apiUrl = `https://api.opencagedata.com/geocode/v1/json?key=${apiKey}&q=${latitude}+${longitude}&pretty=1`;

  try {
    const response = await axios.get(apiUrl);
    const city = response.data.results[0]?.components.city;

    if (city) {
      return city;
    } else {
      console.error('City not found in reverse geocoding response');
      return null;
    }
  } catch (error) {
    console.error('Error fetching city name:', error.message);
    return null;
  }
};

function Home() {
  const [cities, setCities] = useState(['Dar es Salaam', 'Tokyo', 'Lindi', 'London', 'Mtwara', 'Mwanza', 'Dodoma', 'Mbeya', 'Paris']);
  const [filteredCities, setFilteredCities] = useState(cities);
  const [selectedCity, setSelectedCity] = useState('');
  const [weatherData, setWeatherData] = useState({});
  const [userLocation, setUserLocation] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    // Load weather data for all cities in the array
    cities.forEach(async (city) => {
      try {
        const data = await fetchWeatherByCityName(city);
        setWeatherData((prevData) => ({ ...prevData, [city]: data }));
      } catch (error) {
        console.error(error);
      }
    });

    // Check for geolocation support
    if (navigator.geolocation && !userLocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const city = await fetchCityNameByCoordinates(latitude, longitude);
          setUserLocation(city);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }, [userLocation]);

  const handleCityChange = async (e) => {
    const { value } = e.target;
    const errorElement = document.getElementById('error-message');

    // Clear the error message when the user starts typing in the input field
    errorElement.textContent = '';

    if (e.key === 'Enter') {
      try {
        // Attempt to fetch data from the API for the entered city
        const data = await fetchWeatherByCityName(value);

        if (data && data.current) {
          // Data is available, update weatherData with the new city data
          setWeatherData((prevData) => ({ ...prevData, [value]: data }));

          // Add the current input to the search history
          setSearchHistory((prevHistory) => [...prevHistory, value]);

          // Save search history to local storage
          localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

          // Add the current input to the array list
          setCities((prevCities) => [...prevCities, value]);
          // Clear the input field
          setSelectedCity('');
          // Update filteredCities to include the new city
          setFilteredCities((prevFilteredCities) => [...prevFilteredCities, value]);
        } else {
          // No data received from the API or incomplete data, display "City not found" error
          errorElement.textContent = 'Sorry, City not found';

          // Remove the city from the array if there is an error
          setCities((prevCities) => prevCities.filter((city) => city !== value));
          // Update filteredCities to exclude the city with an error
          setFilteredCities((prevFilteredCities) => prevFilteredCities.filter((city) => city !== value));
        }
      } catch (error) {
        // Handle API fetch error if needed
        console.error(error);
        // Display "City not found" error for API fetch errors
        errorElement.textContent = 'City not found';

        // Remove the city from the array if there is an error
        setCities((prevCities) => prevCities.filter((city) => city !== value));
        // Update filteredCities to exclude the city with an error
        setFilteredCities((prevFilteredCities) => prevFilteredCities.filter((city) => city !== value));
      }
    } else {
      setSelectedCity(value);
    }
  };

  return (
    <div className="container">
           <div className="search-container">
        <input
          className='search'
          type="text"
          placeholder="Search for city"
          value={selectedCity}
          onChange={handleCityChange}
          onKeyPress={handleCityChange}
          onFocus={() => setShowHistory(true)}
          onBlur={() => setShowHistory(false)}
        />
        {showHistory && searchHistory.length > 0 && (
          <div className="search-history">
            <ul className='histo'>
              {searchHistory.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div id='error-message'></div>
      {userLocation ? (
        <p> Current location, {userLocation}.</p>
      ) : (
        <div/>
      )}
      {document.getElementById('error-message') && document.getElementById('error-message').textContent === '' && (
        <ul className="card-list">
          {filteredCities.map((city) => (
            <li key={city} className="card">
              {weatherData[city] ? (
                <div className='cardtext'>
                  <div className='left'>
                    <p>
                      <span className='celsius'>
                        {weatherData[city].current.temp_c}°
                      </span>
                      <span className='faren'>C/
                        {weatherData[city].current.temp_f}
                        °F
                      </span>
                    </p>
                    <p>
                      Humidity:
                      {' '}
                      {weatherData[city].current.humidity}
                      %
                    </p>
                    <p>
                      {' '}
                      {city}
                      <span>, {' '}
                        {weatherData[city].location.country}</span>
                    </p>
                    <p>
                      Lat/Lon:
                      {' '}
                      {weatherData[city].location.lat}
                      /
                      {weatherData[city].location.lon}
                    </p>
                  </div>
                  <div className="right">
                    <Link to={`/details/${city}`}><FontAwesomeIcon icon={faArrowCircleRight} className="arrow-icon" /></Link>
                    <img className='image' src={weatherData[city].current.condition.icon} alt="Weather Condition" />
                    <p>
                      Wind Speed:
                      {' '}
                      {weatherData[city].current.wind_kph}
                      {' '}
                      km/h
                    </p>
                    <p>
                      Condition:
                      {' '}
                      {weatherData[city].current.condition.text}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="loading-spinner" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Home;
