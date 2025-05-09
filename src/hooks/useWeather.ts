import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, AppDispatch} from '../store';
import {fetchWeather, setLastSearchedCity} from '../store/weatherSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS} from '../constants/config';

export const useWeather = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {data, loading, error, lastSearchedCity} = useSelector(
    (state: RootState) => state.weather,
  );

  const searchWeather = useCallback(
    async (city: string) => {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.LAST_SEARCHED_CITY, city);
        dispatch(setLastSearchedCity(city));
        dispatch(fetchWeather(city));
      } catch (error) {
        console.error('Error saving last searched city:', error);
      }
    },
    [dispatch],
  );

  const loadLastSearchedCity = useCallback(async () => {
    try {
      const savedCity = await AsyncStorage.getItem(
        STORAGE_KEYS.LAST_SEARCHED_CITY,
      );
      if (savedCity) {
        dispatch(setLastSearchedCity(savedCity));
        dispatch(fetchWeather(savedCity));
        return savedCity;
      }
    } catch (error) {
      console.error('Error loading last searched city:', error);
    }
    return null;
  }, [dispatch]);

  return {
    weatherData: data,
    loading,
    error,
    lastSearchedCity,
    searchWeather,
    loadLastSearchedCity,
  };
};
