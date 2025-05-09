import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, StyleSheet, ActivityIndicator, Image} from 'react-native';
import {WeatherData, ForecastDay} from '../../types/weather';
import Icon from 'react-native-vector-icons/Ionicons';
import weatherService from '../../services/weatherService';

// Constants
const ICON_BASE_URL = 'https://cdn-icons-png.flaticon.com/512/';
const WEATHER_ICONS = {
  cloud: `${ICON_BASE_URL}414/414927.png`,
  rain: `${ICON_BASE_URL}3351/3351979.png`,
  snow: `${ICON_BASE_URL}642/642102.png`,
  thunder: `${ICON_BASE_URL}1779/1779940.png`,
  sunny: `${ICON_BASE_URL}979/979585.png`,
  fog: `${ICON_BASE_URL}4150/4150903.png`,
  default: `${ICON_BASE_URL}1163/1163661.png`,
};

interface WeatherCardProps {
  data: WeatherData;
}

// Returns the appropriate weather icon URL for the weather condition
const getWeatherIconUrl = (condition: string) => {
  const normalizedCondition = condition.toLowerCase();

  if (
    normalizedCondition.includes('cloud') ||
    normalizedCondition.includes('overcast')
  ) {
    return WEATHER_ICONS.cloud;
  } else if (normalizedCondition.includes('rain')) {
    return WEATHER_ICONS.rain;
  } else if (normalizedCondition.includes('snow')) {
    return WEATHER_ICONS.snow;
  } else if (normalizedCondition.includes('thunder')) {
    return WEATHER_ICONS.thunder;
  } else if (
    normalizedCondition.includes('clear') ||
    normalizedCondition.includes('sunny')
  ) {
    return WEATHER_ICONS.sunny;
  } else if (
    normalizedCondition.includes('mist') ||
    normalizedCondition.includes('fog')
  ) {
    return WEATHER_ICONS.fog;
  }

  return WEATHER_ICONS.default;
};

// Format sunrise/sunset time - convert to Indian Standard Time (IST)
const formatTime = (timestamp: number | undefined): string => {
  if (!timestamp) {
    return '--:-- --';
  }

  // Convert UTC timestamp to Indian Standard Time (UTC+5:30)
  const date = new Date(timestamp * 1000);

  // Manual conversion to IST (UTC+5:30)
  const hoursUTC = date.getUTCHours();
  const minutesUTC = date.getUTCMinutes();

  // Add 5 hours and 30 minutes for IST
  let hoursIST = hoursUTC + 5;
  let minutesIST = minutesUTC + 30;

  // Handle minute overflow
  if (minutesIST >= 60) {
    hoursIST += 1;
    minutesIST -= 60;
  }

  // Handle hour overflow
  if (hoursIST >= 24) {
    hoursIST -= 24;
  }

  // Format the time with AM/PM
  const period = hoursIST >= 12 ? 'PM' : 'AM';
  const hours12 =
    hoursIST > 12 ? hoursIST - 12 : hoursIST === 0 ? 12 : hoursIST;
  const minutesFormatted = minutesIST < 10 ? `0${minutesIST}` : minutesIST;
  const hoursFormatted = hours12 < 10 ? `0${hours12}` : hours12;

  return `${hoursFormatted}:${minutesFormatted} ${period} IST`;
};

// Forecast Day Component
const ForecastDayItem = ({
  day,
  temperature,
  condition,
  index,
}: ForecastDay & {index?: number}) => (
  <View style={styles.forecastDay} testID={`forecast-day-${index || 0}`}>
    <Text style={styles.forecastDayText}>{day}</Text>
    <Image
      source={{uri: getWeatherIconUrl(condition)}}
      style={styles.forecastIcon}
      resizeMode="contain"
      testID={`forecast-icon-${index || 0}`}
    />
    <Text style={styles.forecastTemp}>{temperature}°</Text>
  </View>
);

const WeatherCard: React.FC<WeatherCardProps> = ({data}) => {
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loadingForecast, setLoadingForecast] = useState(false);
  const [forecastError, setForecastError] = useState<string | null>(null);

  // Extract data with safe defaults
  const city = data?.city || 'Unknown';
  const temperature = data?.temperature || 0;
  const condition = data?.condition || 'Unknown';
  const humidity = data?.humidity || 0;
  const windSpeed = data?.windSpeed || 0;
  const country = data?.country || 'Unknown';
  const sunrise = data?.sunrise;

  const fetchForecast = useCallback(async () => {
    if (!city || city === 'Unknown') {
      return;
    }

    try {
      setLoadingForecast(true);
      setForecastError(null);
      const forecastData = await weatherService.getDailyForecast(city);
      setForecast(forecastData);
    } catch (error) {
      console.error('Failed to fetch forecast:', error);
      setForecastError('Failed to load forecast data');
    } finally {
      setLoadingForecast(false);
    }
  }, [city]);

  useEffect(() => {
    fetchForecast();
  }, [fetchForecast]);

  return (
    <View style={styles.container} testID="weather-card">
      {/* City and Country */}
      <View style={styles.locationContainer}>
        <Text style={styles.cityName}>{city}</Text>
        <Text style={styles.countryName}>{country}</Text>
      </View>

      {/* Weather Icon */}
      <View style={styles.weatherIconContainer}>
        <Image
          source={{uri: getWeatherIconUrl(condition)}}
          style={styles.weatherIcon}
          resizeMode="contain"
          testID="weather-main-icon"
        />
      </View>

      {/* Temperature and Condition */}
      <View style={styles.temperatureContainer}>
        <Text style={styles.temperature}>{temperature}°</Text>
        <Text style={styles.condition}>{condition}</Text>
      </View>

      {/* Weather Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Icon name="speedometer-outline" size={28} color="#fff" />
          <Text style={styles.detailValue}>{windSpeed} km</Text>
        </View>
        <View style={styles.detailItem}>
          <Icon name="water-outline" size={28} color="#fff" />
          <Text style={styles.detailValue}>{humidity}%</Text>
        </View>
        <View style={styles.detailItem}>
          <Icon name="sunny-outline" size={28} color="#fff" />
          <Text style={styles.detailValue}>{formatTime(sunrise)}</Text>
        </View>
      </View>

      {/* Daily Forecast Section */}
      <View style={styles.forecastSection} testID="forecast-section">
        <View style={styles.forecastHeader}>
          <Icon name="calendar-outline" size={20} color="#fff" />
          <Text style={styles.forecastTitle}>Daily forecast</Text>
        </View>

        <View style={styles.forecastContainer}>
          {loadingForecast ? (
            <ActivityIndicator
              size="large"
              color="#fff"
              style={styles.forecastLoader}
              testID="forecast-loader"
            />
          ) : forecast.length > 0 ? (
            forecast.map((day, index) => (
              <ForecastDayItem key={index} {...day} index={index} />
            ))
          ) : (
            <Text style={styles.noForecastText} testID="no-forecast-text">
              {forecastError || 'No forecast available'}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  locationContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  cityName: {
    fontSize: 36,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
  },
  countryName: {
    fontSize: 22,
    color: '#fff',
    opacity: 0.8,
    marginTop: 2,
  },
  weatherIconContainer: {
    alignItems: 'center',
    marginTop: 5,
  },
  weatherIcon: {
    width: 120,
    height: 120,
  },
  temperatureContainer: {
    alignItems: 'center',
    marginTop: 0,
  },
  temperature: {
    fontSize: 70,
    fontWeight: '200',
    color: '#fff',
  },
  condition: {
    fontSize: 22,
    fontWeight: '300',
    color: '#fff',
    textTransform: 'capitalize',
    marginTop: 0,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingHorizontal: 20,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailValue: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
  forecastSection: {
    marginTop: 15,
  },
  forecastHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  forecastTitle: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 8,
    fontWeight: '400',
  },
  forecastContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forecastDay: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 8,
    flex: 1,
    marginHorizontal: 4,
    height: 110,
    justifyContent: 'space-between',
  },
  forecastDayText: {
    color: '#fff',
    fontSize: 14,
  },
  forecastIcon: {
    width: 40,
    height: 40,
  },
  forecastTemp: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '400',
  },
  forecastLoader: {
    flex: 1,
    height: 110,
  },
  noForecastText: {
    color: '#fff',
    opacity: 0.7,
    textAlign: 'center',
    flex: 1,
  },
});

export default WeatherCard;
