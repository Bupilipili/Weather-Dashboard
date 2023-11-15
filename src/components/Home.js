import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import fetchWeatherByCityName from '../services/api';
import './Home.css';

function Home() {
  const [cities, setCities] = useState(['Dar es Salaam', 'Tokyo', 'Lindi', 'London', 'Mtwara', 'Mwanza', 'Dodoma', 'Mbeya', 'Paris']);
  const [filteredCities, setFilteredCities] = useState(cities);
  const [selectedCity, setSelectedCity] = useState('');
  const [weatherData, setWeatherData] = useState({}); // Initialize as an empty object

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
  }, [cities]);

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

      // Check if the input matches any existing city from the API data
      const matchingCity = Object.keys(weatherData).find(
        (city) => city.toLowerCase() === value.toLowerCase(),
      );

      // If the input matches an existing city, set filteredCities to contain only that matching city
      if (matchingCity) {
        setFilteredCities([matchingCity]);
      } else {
        // Filter the cities based on the input value
        const filtered = cities.filter((city) => city.toLowerCase().includes(value.toLowerCase()));

        // Update filteredCities with the filtered list
        setFilteredCities(filtered);
      }
    }
  };

  return (
    <div className="container">
      <input
        className='search'
        type="text"
        placeholder="Search for city"
        value={selectedCity}
        onChange={handleCityChange}
        onKeyPress={handleCityChange}
      />
      <div id='error-message'></div>
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
