const API_KEY = '786177d666c24f5f86d121735230609'; // Replace with your actual API key
const BASE_URL = 'https://api.weatherapi.com/v1';

// Function to fetch weather data by city name
async function fetchWeatherByCityName(cityName) {
  try {
    const response = await fetch(`${BASE_URL}/current.json?key=${API_KEY}&q=${cityName}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error fetching weather data: ${error.message}`);
  }
}

export default fetchWeatherByCityName;
