import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import fetchWeatherByCityName from '../services/api';
import './Home.css';

function Home() {
  const [cities, setCities] = useState(['Dar es Salaam', 'Tokyo', 'Lindi', 'London', 'Mtwara', 'Mwanza', 'Dodoma', 'Mbeya', 'Paris', 'Beijing', 'Arusha', 'Moscow', 'Istanbul',
    'Dubai', 'Singapore', 'Sydney', 'Rio de Janeiro', 'Mumbai', 'Rome', 'Toronto', 'Buenos Aires', 'Cairo',
    'Hong Kong', 'Amsterdam', 'Seoul', 'Barcelona', 'San Francisco', 'Chicago', 'Bangkok', 'Berlin',
    'Kuala Lumpur', 'New York', 'Vancouver', 'Mombasa', 'Athens', 'Cape Town', 'Prague', 'Lisbon',
    'Mexico City', 'Stockholm', 'Hanoi', 'Johannesburg', 'Helsinki', 'Oslo', 'Dublin', 'Budapest', 'Warsaw',
    'Vienna', 'Brussels', 'Manila', 'Lima', 'Bogota', 'Bukoba', 'Kigali', 'Bucharest', 'Madrid', 'Nairobi', 'Abu Dhabi',
    'Brisbane', 'Auckland', 'Montreal', 'Amman', 'Guatemala City', 'Tehran', 'Kiev', 'Kabul', 'Santiago',
    'Caracas', 'Managua', 'San Salvador', 'Tbilisi', 'Beirut', 'Zagreb', 'Sofia', 'Sarajevo', 'Havana',
    'Tallinn', 'Belgrade', 'Ljubljana', 'Skopje', 'Podgorica', 'Riga', 'Vilnius', 'Luxembourg City',
    'Valletta', 'Chisinau', 'Monaco', 'Andorra la Vella', 'San Marino', 'Vatican City']);
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

      // Display error message if the input city is not found
      const errorElement = document.getElementById('error-message');
      if (filtered.length === 0 && value.trim() !== '') {
        errorElement.textContent = 'City not found';
      } else {
        errorElement.textContent = '';
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
      />
      <div id='error-message'></div>
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
    </div>
  );
}

export default Home;
