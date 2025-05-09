import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {ERROR_MESSAGES} from '../constants/config';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import WeatherCard from '../components/weather/WeatherCard';
import {useWeather} from '../hooks/useWeather';

const HomeScreen: React.FC = () => {
  const [city, setCity] = useState('');
  const {weatherData, loading, error, searchWeather, loadLastSearchedCity} =
    useWeather();

  useEffect(() => {
    loadLastSearchedCity().then(savedCity => {
      if (savedCity) {
        setCity(savedCity);
      }
    });
  }, [loadLastSearchedCity]);

  const handleSearch = () => {
    if (!city.trim()) {
      Alert.alert('Error', ERROR_MESSAGES.INVALID_CITY);
      return;
    }
    searchWeather(city);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.searchContainer}>
          <Input
            label="Enter City Name"
            value={city}
            onChangeText={setCity}
            placeholder="e.g., London, New York"
            autoCapitalize="words"
            error={error || undefined}
          />
          <Button
            title="Search"
            onPress={handleSearch}
            loading={loading}
            disabled={!city.trim()}
          />
        </View>

        {weatherData && <WeatherCard data={weatherData} />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  searchContainer: {
    marginBottom: 24,
  },
});

export default HomeScreen;
