export interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  country?: string;
  sunrise?: number;
  sunset?: number;
}

export interface ForecastDay {
  day: string;
  temperature: number;
  condition: string;
  icon: string;
}

export interface WeatherState {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
  lastSearchedCity: string | null;
}

export interface WeatherError {
  message: string;
  code: string;
}
