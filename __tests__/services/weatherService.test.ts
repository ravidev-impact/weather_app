import axios from 'axios';
import weatherService from '../../src/services/weatherService';
import {API_CONFIG} from '../../src/constants/config';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WeatherService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getWeatherByCity', () => {
    it('should fetch weather data successfully', async () => {
      // Mock API response
      const mockWeatherResponse = {
        data: {
          name: 'London',
          main: {
            temp: 15.5,
            feels_like: 14.2,
            humidity: 76,
          },
          weather: [
            {
              main: 'Clouds',
              icon: '03d',
            },
          ],
          wind: {
            speed: 4.1,
          },
          sys: {
            country: 'GB',
            sunrise: 1621123456,
            sunset: 1621174321,
          },
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockWeatherResponse);

      // Call the service method
      const result = await weatherService.getWeatherByCity('London');

      // Assert axios was called correctly
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${API_CONFIG.BASE_URL}/weather`,
        expect.objectContaining({
          params: expect.objectContaining({
            q: 'London',
            appid: expect.any(String),
            units: API_CONFIG.UNITS,
          }),
        }),
      );

      // Assert the returned data is transformed correctly
      expect(result).toEqual({
        city: 'London',
        temperature: 16, // rounded from 15.5
        condition: 'Clouds',
        icon: '03d',
        humidity: 76,
        windSpeed: 4.1,
        feelsLike: 14, // rounded from 14.2
        country: 'GB',
        sunrise: 1621123456,
        sunset: 1621174321,
      });
    });

    it('should throw an error if city not found', async () => {
      // Mock API error response
      const errorResponse = {
        response: {
          status: 404,
          data: {
            message: 'city not found',
          },
        },
      };

      mockedAxios.get.mockRejectedValueOnce(errorResponse);

      // Call the service method and expect it to throw
      await expect(
        weatherService.getWeatherByCity('NonExistentCity'),
      ).rejects.toEqual({
        message: 'City not found',
        code: 'CITY_NOT_FOUND',
      });
    });

    it('should throw an error if data is invalid', async () => {
      // Mock invalid API response
      const mockInvalidResponse = {
        data: {
          name: 'London',
          // Missing main property
          weather: [],
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockInvalidResponse);

      // Call the service method and expect it to throw
      await expect(weatherService.getWeatherByCity('London')).rejects.toThrow(
        'Invalid data received from weather API',
      );
    });
  });

  describe('getDailyForecast', () => {
    it('should fetch forecast data successfully', async () => {
      // Create a fixed timestamp for testing
      const fixedTimestamp = 1683720000000; // 2023-05-10T12:00:00Z

      // Mock Date.now() to return our fixed timestamp
      const originalDateNow = Date.now;
      Date.now = jest.fn(() => fixedTimestamp);

      try {
        // Mock API response with forecast data
        const mockForecastResponse = {
          data: {
            list: [
              // Today
              {
                dt: fixedTimestamp / 1000,
                main: {temp: 16},
                weather: [{main: 'Clear'}],
              },
              // Tomorrow
              {
                dt: fixedTimestamp / 1000 + 86400,
                main: {temp: 18},
                weather: [{main: 'Clouds', icon: '03d'}],
              },
              // Day after tomorrow mid-day
              {
                dt: fixedTimestamp / 1000 + 86400 * 2 + 43200,
                main: {temp: 20},
                weather: [{main: 'Rain', icon: '10d'}],
              },
              // Day after tomorrow evening
              {
                dt: fixedTimestamp / 1000 + 86400 * 2 + 64800,
                main: {temp: 17},
                weather: [{main: 'Rain', icon: '10n'}],
              },
            ],
          },
        };

        mockedAxios.get.mockResolvedValueOnce(mockForecastResponse);

        // Call the service method
        const result = await weatherService.getDailyForecast('London');

        // Expected forecast (should pick the mid-day forecast for each day)
        expect(result.length).toBeGreaterThan(0);
        expect(result[0]).toMatchObject({
          temperature: expect.any(Number),
          condition: expect.any(String),
        });

        // Assert axios was called correctly
        expect(mockedAxios.get).toHaveBeenCalledWith(
          `${API_CONFIG.BASE_URL}/forecast`,
          expect.objectContaining({
            params: expect.objectContaining({
              q: 'London',
              appid: expect.any(String),
              units: API_CONFIG.UNITS,
              cnt: 40,
            }),
          }),
        );
      } finally {
        // Restore original Date.now
        Date.now = originalDateNow;
      }
    });

    it('should return empty array if API fails', async () => {
      // Mock API error response
      const errorResponse = {
        response: {
          status: 500,
          data: {
            message: 'Internal server error',
          },
        },
      };

      mockedAxios.get.mockRejectedValueOnce(errorResponse);

      // Call the service method
      const result = await weatherService.getDailyForecast('London');

      // Should return empty array instead of throwing
      expect(result).toEqual([]);
    });
  });
});
