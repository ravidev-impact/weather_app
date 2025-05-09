import axios from 'axios';
import {API_CONFIG} from '../constants/config';
import {WeatherData, WeatherError, ForecastDay} from '../types/weather';

class WeatherService {
  private static instance: WeatherService;
  private readonly baseURL: string;
  private readonly apiKey: string;

  private constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.apiKey = API_CONFIG.API_KEY || '';
  }

  public static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  private async fetchWeatherData(city: string): Promise<any> {
    try {
      const url = `${this.baseURL}/weather`;
      const response = await axios.get(url, {
        params: {
          q: city,
          appid: this.apiKey,
          units: API_CONFIG.UNITS,
        },
        timeout: API_CONFIG.TIMEOUT,
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private async fetchForecastData(city: string): Promise<any> {
    try {
      const url = `${this.baseURL}/forecast`;

      const response = await axios.get(url, {
        params: {
          q: city,
          appid: this.apiKey,
          units: API_CONFIG.UNITS,
          cnt: 40, // Get 5 days of data (8 points per day)
        },
        timeout: API_CONFIG.TIMEOUT,
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): WeatherError {
    if (error.response) {
      switch (error.response.status) {
        case 404:
          return {message: 'City not found', code: 'CITY_NOT_FOUND'};
        case 401:
          return {message: 'Invalid API key', code: 'INVALID_API_KEY'};
        case 429:
          return {message: 'Too many requests', code: 'RATE_LIMIT'};
        default:
          return {
            message: `Server error (${error.response.status})`,
            code: 'SERVER_ERROR',
          };
      }
    }
    if (error.request) {
      // Request made but no response received
      return {message: 'No response from server', code: 'TIMEOUT'};
    }
    return {message: 'Network error', code: 'NETWORK_ERROR'};
  }

  public async getWeatherByCity(city: string): Promise<WeatherData> {
    try {
      const data = await this.fetchWeatherData(city);

      if (!data || !data.main || !data.weather || data.weather.length === 0) {
        throw new Error('Invalid data received from weather API');
      }

      return {
        city: data.name,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        feelsLike: Math.round(data.main.feels_like),
        country: data.sys?.country,
        sunrise: data.sys?.sunrise,
        sunset: data.sys?.sunset,
      };
    } catch (error) {
      throw error;
    }
  }

  public async getDailyForecast(city: string): Promise<ForecastDay[]> {
    try {
      const data = await this.fetchForecastData(city);

      // Process the forecast data to get one entry per day
      const dailyForecasts: ForecastDay[] = [];
      const today = new Date();

      // Group by day
      const forecastsByDay: {[key: string]: any[]} = {};

      if (!data.list || data.list.length === 0) {
        return [];
      }

      data.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString('en-US', {weekday: 'long'});

        // Skip today
        if (
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        ) {
          return;
        }

        if (!forecastsByDay[day]) {
          forecastsByDay[day] = [];
        }

        forecastsByDay[day].push(item);
      });

      // Take the middle of the day forecast for each day
      Object.keys(forecastsByDay).forEach(day => {
        const dayForecasts = forecastsByDay[day];
        // Use the forecast from the middle of the day if possible
        const middayForecast =
          dayForecasts.find((f: any) => {
            const date = new Date(f.dt * 1000);
            return date.getHours() >= 12 && date.getHours() <= 15;
          }) || dayForecasts[0];

        dailyForecasts.push({
          day: day,
          temperature: Math.round(middayForecast.main.temp),
          condition: middayForecast.weather[0].main,
          icon: middayForecast.weather[0].icon,
        });
      });

      // Return only the next 4 days
      return dailyForecasts.slice(0, 4);
    } catch (error) {
      // Return empty array instead of throwing to avoid breaking UI
      return [];
    }
  }
}

export default WeatherService.getInstance();
