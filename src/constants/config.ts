import {OPENWEATHER_API_KEY} from '@env';

export const API_CONFIG = {
  BASE_URL: 'https://api.openweathermap.org/data/2.5',
  API_KEY: OPENWEATHER_API_KEY,
  UNITS: 'metric',
};

export const STORAGE_KEYS = {
  LAST_SEARCHED_CITY: '@weather_app_last_city',
};

export const ERROR_MESSAGES = {
  CITY_NOT_FOUND: 'City not found. Please check the spelling and try again.',
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  API_ERROR: 'Unable to fetch weather data. Please try again later.',
  INVALID_CITY: 'Please enter a valid city name.',
};

export const WEATHER_CONDITIONS = {
  CLEAR: 'Clear',
  CLOUDS: 'Clouds',
  RAIN: 'Rain',
  SNOW: 'Snow',
  THUNDERSTORM: 'Thunderstorm',
  DRIZZLE: 'Drizzle',
  MIST: 'Mist',
};
