import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import HomeScreen from '../../src/screens/HomeScreen';
import {fetchWeather} from '../../src/store/weatherSlice';
import {setLastSearchedCity} from '../../src/store/searchHistorySlice';
import mockStore from '../utils/mockStore';

// Mock the necessary modules
jest.mock('../../src/components/weather/WeatherCard', () => 'WeatherCard');
jest.mock(
  '../../src/components/weather/CityNotFoundCard',
  () => 'CityNotFoundCard',
);
jest.mock('@react-native-community/blur', () => ({
  BlurView: 'BlurView',
}));

// Mock dispatch functions
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

describe('HomeScreen Component', () => {
  let store: any;

  beforeEach(() => {
    mockDispatch.mockClear();

    // Set up a mock store with initial state
    store = mockStore({
      weather: {
        data: null,
        loading: false,
        error: null,
      },
      searchHistory: {
        lastSearchedCity: null,
        searchHistory: [],
        loading: false,
        error: null,
      },
    });

    // Mock the store's dispatch method
    store.dispatch = jest.fn();
  });

  it('renders correctly in initial state', () => {
    const {toJSON} = render(
      <Provider store={store}>
        <HomeScreen />
      </Provider>,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('renders loading spinner when loading weather data', () => {
    store = mockStore({
      weather: {
        data: null,
        loading: true,
        error: null,
      },
      searchHistory: {
        lastSearchedCity: 'London',
        searchHistory: ['London'],
        loading: false,
        error: null,
      },
    });

    const {getByTestId} = render(
      <Provider store={store}>
        <HomeScreen />
      </Provider>,
    );

    expect(getByTestId('weather-loader')).toBeTruthy();
  });

  it('renders CityNotFoundCard when there is an error', () => {
    store = mockStore({
      weather: {
        data: null,
        loading: false,
        error: 'City not found',
      },
      searchHistory: {
        lastSearchedCity: 'NonExistentCity',
        searchHistory: ['NonExistentCity'],
        loading: false,
        error: null,
      },
    });

    const {getByTestId} = render(
      <Provider store={store}>
        <HomeScreen />
      </Provider>,
    );

    expect(getByTestId('city-not-found-card')).toBeTruthy();
  });

  it('renders WeatherCard when data is available', () => {
    const mockWeatherData = {
      city: 'London',
      temperature: 25,
      condition: 'Clear',
      humidity: 60,
      windSpeed: 5,
      country: 'GB',
    };

    store = mockStore({
      weather: {
        data: mockWeatherData,
        loading: false,
        error: null,
      },
      searchHistory: {
        lastSearchedCity: 'London',
        searchHistory: ['London'],
        loading: false,
        error: null,
      },
    });

    const {getByTestId} = render(
      <Provider store={store}>
        <HomeScreen />
      </Provider>,
    );

    expect(getByTestId('weather-card')).toBeTruthy();
  });

  it('loads search history on mount', async () => {
    render(
      <Provider store={store}>
        <HomeScreen />
      </Provider>,
    );

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  it('handles search submission', async () => {
    const {getByTestId, getByPlaceholderText} = render(
      <Provider store={store}>
        <HomeScreen />
      </Provider>,
    );

    // Enter a city in the search bar
    const searchInput = getByPlaceholderText('Search city...');
    fireEvent.changeText(searchInput, 'London');

    // Submit the search
    const searchButton = getByTestId('search-button');
    fireEvent.press(searchButton);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(fetchWeather('London'));
      expect(mockDispatch).toHaveBeenCalledWith(setLastSearchedCity('London'));
    });
  });

  it('validates empty search input', async () => {
    const {getByTestId, getByPlaceholderText, findByText} = render(
      <Provider store={store}>
        <HomeScreen />
      </Provider>,
    );

    // Submit an empty search
    const searchInput = getByPlaceholderText('Search city...');
    fireEvent.changeText(searchInput, '');

    const searchButton = getByTestId('search-button');
    fireEvent.press(searchButton);

    // Should show validation error
    const errorMessage = await findByText('Please enter a city name');
    expect(errorMessage).toBeTruthy();

    // Should not dispatch actions for empty search
    expect(mockDispatch).not.toHaveBeenCalledWith(fetchWeather(''));
  });
});
