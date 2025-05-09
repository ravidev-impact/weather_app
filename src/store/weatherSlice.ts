import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {WeatherState, WeatherData} from '../types/weather';
import weatherService from '../services/weatherService';
import {ERROR_MESSAGES} from '../constants/config';

const initialState: WeatherState = {
  data: null,
  loading: false,
  error: null,
  lastSearchedCity: null,
};

export const fetchWeather = createAsyncThunk(
  'weather/fetchWeather',
  async (city: string, {rejectWithValue}) => {
    try {
      const data = await weatherService.getWeatherByCity(city);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    setLastSearchedCity: (state, action) => {
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
        state.data = action.payload as WeatherData;
        state.error = null;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || ERROR_MESSAGES.API_ERROR;
      });
  },
});

export const {clearError, setLastSearchedCity} = weatherSlice.actions;
export default weatherSlice.reducer;
