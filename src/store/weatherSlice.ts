import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {WeatherState, WeatherData, WeatherError} from '../types/weather';
import weatherService from '../services/weatherService';
import {ERROR_MESSAGES} from '../constants/config';

const initialState: WeatherState = {
  data: null,
  loading: false,
  error: null,
  lastSearchedCity: null,
};

// Thunk for fetching weather data
export const fetchWeather = createAsyncThunk<
  WeatherData,
  string,
  {rejectValue: string}
>('weather/fetchWeather', async (city: string, {rejectWithValue}) => {
  try {
    if (!city.trim()) {
      return rejectWithValue(ERROR_MESSAGES.INVALID_CITY);
    }

    const data = await weatherService.getWeatherByCity(city);
    return data;
  } catch (error: any) {
    // Handle WeatherError type or generic error
    if (error.code) {
      const weatherError = error as WeatherError;
      // Handle known error codes with predefined messages
      switch (weatherError.code) {
        case 'CITY_NOT_FOUND':
          return rejectWithValue(ERROR_MESSAGES.CITY_NOT_FOUND);
        case 'NETWORK_ERROR':
          return rejectWithValue(ERROR_MESSAGES.NETWORK_ERROR);
        default:
          return rejectWithValue(weatherError.message);
      }
    }
    return rejectWithValue(error.message || ERROR_MESSAGES.API_ERROR);
  }
});

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    setLastSearchedCity: (state, action: PayloadAction<string>) => {
      state.lastSearchedCity = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchWeather.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || ERROR_MESSAGES.API_ERROR;
      });
  },
});

export const {clearError, setLastSearchedCity} = weatherSlice.actions;
export default weatherSlice.reducer;
