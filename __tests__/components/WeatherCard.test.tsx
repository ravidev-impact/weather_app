import React from 'react';
import {render, waitFor} from '@testing-library/react-native';
import WeatherCard from '../../src/components/weather/WeatherCard';
import weatherService from '../../src/services/weatherService';

// Mock the weather service
jest.mock('../../src/services/weatherService', () => ({
  getDailyForecast: jest.fn(),
}));

describe('WeatherCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock implementation for getDailyForecast
    (weatherService.getDailyForecast as jest.Mock).mockResolvedValue([
      {day: 'Monday', temperature: 20, condition: 'Clear', icon: '01d'},
      {day: 'Tuesday', temperature: 22, condition: 'Clouds', icon: '02d'},
      {day: 'Wednesday', temperature: 18, condition: 'Rain', icon: '10d'},
      {
        day: 'Thursday',
        temperature: 17,
        condition: 'Thunderstorm',
        icon: '11d',
      },
    ]);
  });

  it('renders correctly with full weather data', async () => {
    const mockWeatherData = {
      city: 'London',
      country: 'GB',
      temperature: 25,
      condition: 'Clear',
      humidity: 60,
      windSpeed: 5,
      feelsLike: 27,
      sunrise: 1621123456,
      sunset: 1621174321,
      icon: '01d',
    };

    const {getByText, findByText, toJSON} = render(
      <WeatherCard data={mockWeatherData} />,
    );

    // Check if basic data is rendered
    expect(getByText('London')).toBeTruthy();
    expect(getByText('GB')).toBeTruthy();
    expect(getByText('25°')).toBeTruthy();
    expect(getByText('Clear')).toBeTruthy();
    expect(getByText('60%')).toBeTruthy();
    expect(getByText('5 km')).toBeTruthy();

    // Wait for the forecast to be loaded
    await waitFor(() => {
      expect(weatherService.getDailyForecast).toHaveBeenCalledWith('London');
      expect(findByText('Monday')).toBeTruthy();
    });

    // Check snapshot
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders with default values for missing data', () => {
    const mockPartialData = {
      city: '',
      temperature: 0,
      condition: '',
    };

    const {getByText} = render(<WeatherCard data={mockPartialData as any} />);

    expect(getByText('Unknown')).toBeTruthy(); // Default city name
    expect(getByText('0°')).toBeTruthy(); // Default temperature
    expect(getByText('Unknown')).toBeTruthy(); // Default condition
  });

  it('handles forecast loading state', async () => {
    // Mock a delay in forecast loading
    (weatherService.getDailyForecast as jest.Mock).mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve([
            {day: 'Monday', temperature: 20, condition: 'Clear', icon: '01d'},
          ]);
        }, 100);
      });
    });

    const mockWeatherData = {
      city: 'London',
      country: 'GB',
      temperature: 25,
      condition: 'Clear',
      humidity: 60,
      windSpeed: 5,
      feelsLike: 27,
      sunrise: 1621123456,
      sunset: 1621174321,
      icon: '01d',
    };

    const {queryByTestId, findByTestId} = render(
      <WeatherCard data={mockWeatherData} />,
    );

    // Should show loading indicator initially
    expect(queryByTestId('forecast-loader')).toBeTruthy();

    // Wait for forecast to load
    await waitFor(() => {
      expect(findByTestId('forecast-day-0')).toBeTruthy();
      expect(queryByTestId('forecast-loader')).toBeNull();
    });
  });

  it('handles forecast error state', async () => {
    // Mock forecast error
    (weatherService.getDailyForecast as jest.Mock).mockRejectedValue(
      new Error('Failed to fetch forecast'),
    );

    const mockWeatherData = {
      city: 'London',
      country: 'GB',
      temperature: 25,
      condition: 'Clear',
      humidity: 60,
      windSpeed: 5,
    };

    const {findByText} = render(<WeatherCard data={mockWeatherData as any} />);

    // Wait for error message
    await waitFor(() => {
      expect(findByText('Failed to load forecast data')).toBeTruthy();
    });
  });
});
