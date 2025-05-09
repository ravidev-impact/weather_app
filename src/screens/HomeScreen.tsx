import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, AppDispatch} from '../store';
import {fetchWeather} from '../store/weatherSlice';
import {
  setLastSearchedCity,
  loadSavedHistory,
} from '../store/searchHistorySlice';
import SearchBar from '../components/search/SearchBar';
import WeatherCard from '../components/weather/WeatherCard';
import CityNotFoundCard from '../components/weather/CityNotFoundCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const {
    data,
    loading,
    error: weatherError,
  } = useSelector((state: RootState) => state.weather);
  const {lastSearchedCity} = useSelector(
    (state: RootState) => state.searchHistory,
  );

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const [lastCity, history] = await Promise.all([
          AsyncStorage.getItem('lastSearchedCity'),
          AsyncStorage.getItem('searchHistory'),
        ]);
        dispatch(
          loadSavedHistory({
            lastCity,
            history: history ? JSON.parse(history) : [],
          }),
        );
      } catch (error) {
        console.error('Error loading search history:', error);
      }
    };
    loadHistory();
  }, [dispatch]);

  useEffect(() => {
    if (lastSearchedCity) {
      setSearchQuery(lastSearchedCity);
      dispatch(fetchWeather(lastSearchedCity));
    }
  }, [lastSearchedCity, dispatch]);

  const handleSearch = () => {
    setError(undefined);

    if (!searchQuery.trim()) {
      setError('Please enter a city name');
      return;
    }

    const trimmedQuery = searchQuery.trim();
    dispatch(fetchWeather(trimmedQuery));
    dispatch(setLastSearchedCity(trimmedQuery));
  };

  const handleSearchFocus = (focused: boolean) => {
    setIsSearchFocused(focused);
  };
  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator size="large" color="#fff" style={styles.loader} />
      );
    }

    if (weatherError) {
      return <CityNotFoundCard />;
    }

    if (data) {
      return <WeatherCard data={data} />;
    }

    return null;
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1601134467661-3d775b999c8b?q=80&w=2075&auto=format&fit=crop',
      }}
      style={styles.backgroundImage}
      resizeMode="cover">
      <View style={styles.overlay}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
          hidden={Platform.OS === 'android'}
        />
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.content}>
            <View style={styles.searchContainer}>
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmit={handleSearch}
                error={error}
                onFocusChange={handleSearchFocus}
              />
            </View>
            {!isSearchFocused && (
              <ScrollView
                style={styles.weatherContainer}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled">
                {renderContent()}
              </ScrollView>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay for better text visibility
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight,
  },
  searchContainer: {
    zIndex: 1000,
  },
  weatherContainer: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loader: {
    marginTop: 20,
  },
});

export default HomeScreen;
