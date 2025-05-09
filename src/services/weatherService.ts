import axios from 'axios';
import {API_CONFIG} from '../constants/config';
import {WeatherData, WeatherError} from '../types/weather';

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
      const response = await axios.get(`${this.baseURL}/weather`, {
        params: {
          q: city,
          appid: this.apiKey,
          units: API_CONFIG.UNITS,
        },
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
        default:
          return {message: 'Server error', code: 'SERVER_ERROR'};
      }
    }
    return {message: 'Network error', code: 'NETWORK_ERROR'};
  }

  public async getWeatherByCity(city: string): Promise<WeatherData> {
    const data = await this.fetchWeatherData(city);
    return {
      city: data.name,
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      feelsLike: Math.round(data.main.feels_like),
    };
  }
}

export default WeatherService.getInstance();
