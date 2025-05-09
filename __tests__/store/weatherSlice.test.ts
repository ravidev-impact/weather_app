import weatherReducer, {
  fetchWeather,
  clearError,
  setLastSearchedCity,
} from '../../src/store/weatherSlice';
import weatherService from '../../src/services/weatherService';
import {ERROR_MESSAGES} from '../../src/constants/config';
import mockStore from '../utils/mockStore';

// Mock the weather service
jest.mock('../../src/services/weatherService');
const mockedWeatherService = weatherService as jest.Mocked<
  typeof weatherService
>;

describe('Weather Slice', () => {
  // Test the reducer
  describe('reducer', () => {
    it('should return the initial state', () => {
      expect(weatherReducer(undefined, {type: ''})).toEqual({
        data: null,
        loading: false,
        error: null,
        lastSearchedCity: null,
      });
    });

    it('should handle clearError', () => {
      const initialState = {
        data: null,
        loading: false,
        error: 'Some error',
        lastSearchedCity: null,
      };

      expect(weatherReducer(initialState, clearError())).toEqual({
        data: null,
        loading: false,
        error: null,
        lastSearchedCity: null,
      });
    });

    it('should handle setLastSearchedCity', () => {
      const initialState = {
        data: null,
        loading: false,
        error: null,
        lastSearchedCity: null,
      };

      expect(
        weatherReducer(initialState, setLastSearchedCity('London')),
      ).toEqual({
        data: null,
        loading: false,
        error: null,
        lastSearchedCity: 'London',
      });
    });
  });

  // Test the fetchWeather thunk
  describe('fetchWeather thunk', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should fetch weather successfully', async () => {
      // Mock weather data
      const mockWeatherData = {
        city: 'London',
        temperature: 15,
        condition: 'Clear',
        humidity: 70,
        windSpeed: 5,
        country: 'GB',
        icon: '01d',
        feelsLike: 14,
        sunrise: 1621123456,
        sunset: 1621174321,
      };

      // Setup the mock to return the weather data
      mockedWeatherService.getWeatherByCity.mockResolvedValueOnce(
        mockWeatherData,
      );

      // Create a mock store
      const store = mockStore({
        weather: {
          data: null,
          loading: false,
          error: null,
          lastSearchedCity: null,
        },
      });

      // Dispatch the thunk
      await store.dispatch(fetchWeather('London') as any);

      // Get the actions
      const actions = store.getActions();

      // Check the actions
      expect(actions[0].type).toEqual(fetchWeather.pending.type);
      expect(actions[1].type).toEqual(fetchWeather.fulfilled.type);
      expect(actions[1].payload).toEqual(mockWeatherData);
    });

    it('should handle empty city name', async () => {
      // Create a mock store
      const store = mockStore({
        weather: {
          data: null,
          loading: false,
          error: null,
          lastSearchedCity: null,
        },
      });

      // Dispatch the thunk with empty city
      await store.dispatch(fetchWeather('') as any);

      // Get the actions
      const actions = store.getActions();

      // Check the actions
      expect(actions[0].type).toEqual(fetchWeather.pending.type);
      expect(actions[1].type).toEqual(fetchWeather.rejected.type);
      expect(actions[1].payload).toEqual(ERROR_MESSAGES.INVALID_CITY);
    });

    it('should handle API error', async () => {
      // Mock error from API
      const errorResponse = {
        message: 'City not found',
        code: 'CITY_NOT_FOUND',
      };

      // Setup the mock to throw the error
      mockedWeatherService.getWeatherByCity.mockRejectedValueOnce(
        errorResponse,
      );

      // Create a mock store
      const store = mockStore({
        weather: {
          data: null,
          loading: false,
          error: null,
          lastSearchedCity: null,
        },
      });

      // Dispatch the thunk
      await store.dispatch(fetchWeather('NonExistentCity') as any);

      // Get the actions
      const actions = store.getActions();

      // Check the actions
      expect(actions[0].type).toEqual(fetchWeather.pending.type);
      expect(actions[1].type).toEqual(fetchWeather.rejected.type);
      expect(actions[1].payload).toEqual(ERROR_MESSAGES.CITY_NOT_FOUND);
    });
  });
});
