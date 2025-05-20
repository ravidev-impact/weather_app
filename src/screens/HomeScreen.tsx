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
  SafeAreaView,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, AppDispatch} from '../store';
import {fetchWeather} from '../store/weatherSlice';
import {
  setLastSearchedCity,
  loadSearchHistory,
  saveSearchHistory,
} from '../store/searchHistorySlice';
import SearchBar from '../components/search/SearchBar';
import WeatherCard from '../components/weather/WeatherCard';
import CityNotFoundCard from '../components/weather/CityNotFoundCard';
import {BlurView} from '@react-native-community/blur';

const DEFAULT_CITY = 'London';
const DEFAULT_BACKGROUND =
  'https://images.unsplash.com/photo-1592210454359-9043f067919b?q=80&w=2070&auto=format&fit=crop';

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
  const {searchHistory, error: historyError} = useSelector(
    (state: RootState) => state.searchHistory,
  );

  // Get dynamic background based on weather condition
  const getBackgroundImage = () => {
    if (!data?.condition) {
      return {uri: DEFAULT_BACKGROUND};
    }

    const condition = data.condition.toLowerCase();

    if (condition.includes('cloud') || condition.includes('overcast')) {
      return {
        uri: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=2070&auto=format&fit=crop',
      };
    } else if (condition.includes('rain')) {
      return {
        uri: 'https://images.unsplash.com/photo-1438260483147-81148f799f25?q=80&w=2074&auto=format&fit=crop',
      };
    } else if (condition.includes('snow')) {
      return {
        uri: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?q=80&w=2166&auto=format&fit=crop',
      };
    } else if (condition.includes('thunder')) {
      return {
        uri: 'https://images.unsplash.com/photo-1461511669078-d46bf351cd6e?q=80&w=2070&auto=format&fit=crop',
      };
    } else if (condition.includes('clear') || condition.includes('sunny')) {
      return {
        uri: 'https://images.unsplash.com/photo-1617142137869-325955e2d3cb?q=80&w=2070&auto=format&fit=crop',
      };
    } else if (condition.includes('mist') || condition.includes('fog')) {
      return {
        uri: 'https://images.unsplash.com/photo-1487621167305-5d248087c724?q=80&w=2832&auto=format&fit=crop',
      };
    }

    return {uri: DEFAULT_BACKGROUND};
  };

  useEffect(() => {
    const loadHistory = async () => {
      try {
        // Use the thunk to load search history
        const resultAction = await dispatch(loadSearchHistory());

        if (loadSearchHistory.fulfilled.match(resultAction)) {
          // If there's a last city, load its weather
          if (resultAction.payload.lastCity) {
            setSearchQuery(resultAction.payload.lastCity);
            dispatch(fetchWeather(resultAction.payload.lastCity));
          } else {
            // If no last city, search for a default city
            dispatch(fetchWeather(DEFAULT_CITY));
            dispatch(setLastSearchedCity(DEFAULT_CITY));

            // Save the default city and empty history to AsyncStorage
            dispatch(
              saveSearchHistory({
                city: DEFAULT_CITY,
                history: [DEFAULT_CITY],
              }),
            );

            setSearchQuery(DEFAULT_CITY);
          }
        } else if (historyError) {
          Alert.alert(
            'Error',
            'Failed to load search history. Default city will be used.',
            [{text: 'OK'}],
          );

          // Use default city on error
          dispatch(fetchWeather(DEFAULT_CITY));
          setSearchQuery(DEFAULT_CITY);
        }
      } catch (error) {
        Alert.alert(
          'Error',
          'Failed to load search history. Default city will be used.',
          [{text: 'OK'}],
        );

        dispatch(fetchWeather(DEFAULT_CITY));
        setSearchQuery(DEFAULT_CITY);
      }
    };

    loadHistory();
  }, [dispatch, historyError]);

  const handleSearch = async () => {
    setError(undefined);

    // Always close suggestions when search is submitted
    setIsSearchFocused(false);

    if (!searchQuery.trim()) {
      setError('Please enter a city name');
      return;
    }

    const trimmedQuery = searchQuery.trim();
    const resultAction = await dispatch(fetchWeather(trimmedQuery));
    if (fetchWeather.fulfilled.match(resultAction)) {
      dispatch(setLastSearchedCity(trimmedQuery));
      if (searchHistory) {
        const updatedHistory =
          trimmedQuery !== ''
            ? [
                trimmedQuery,
                ...searchHistory.filter(city => city !== trimmedQuery),
              ].slice(0, 5)
            : searchHistory;

        dispatch(
          saveSearchHistory({
            city: trimmedQuery,
            history: updatedHistory,
          }),
        );
      }
    }
  };

  // Use BlurView for iOS, or overlay with higher opacity for Android
  const renderBlurOverlay = () => {
    if (Platform.OS === 'ios') {
      return (
        <BlurView
          style={styles.blurView}
          blurType="dark"
          blurAmount={1}
          reducedTransparencyFallbackColor="rgba(10, 10, 10, 0.1)"
        />
      );
    }
    return <View style={styles.androidOverlay} />;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="large"
          color="#fff"
          style={styles.loader}
          testID="weather-loader"
        />
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
      source={getBackgroundImage()}
      style={styles.backgroundImage}
      resizeMode="cover">
      {renderBlurOverlay()}
      <View style={styles.overlay}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        <SafeAreaView style={styles.safeArea}>
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
                  // onFocusChange={setIsSearchFocused}
                />
              </View>
              {!isSearchFocused && (
                <ScrollView
                  style={styles.weatherContainer}
                  contentContainerStyle={styles.scrollContent}
                  keyboardShouldPersistTaps="handled"
                  bounces={false}
                  showsVerticalScrollIndicator={false}>
                  {renderContent()}
                </ScrollView>
              )}
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  androidOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    zIndex: 1000,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  weatherContainer: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loader: {
    flex: 1,
    marginTop: 100,
  },
});

export default HomeScreen;
