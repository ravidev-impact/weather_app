import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import {WeatherData} from '../../types/weather';
import Icon from 'react-native-vector-icons/Ionicons';

const {width} = Dimensions.get('window');

interface WeatherCardProps {
  data: WeatherData;
}

const getWeatherIcon = (condition: string) => {
  const normalizedCondition = condition.toLowerCase();
  if (normalizedCondition.includes('rain')) {
    return 'rainy-outline';
  } else if (normalizedCondition.includes('cloud')) {
    return 'cloudy-outline';
  } else if (normalizedCondition.includes('snow')) {
    return 'snow-outline';
  } else if (normalizedCondition.includes('thunder')) {
    return 'thunderstorm-outline';
  } else if (normalizedCondition.includes('clear')) {
    return 'sunny-outline';
  }
  return 'partly-sunny-outline';
};

interface CardContentProps {
  data: WeatherData;
}

const CardContent: React.FC<CardContentProps> = ({data}) => {
  const {city, temperature, condition, humidity, windSpeed, feelsLike, icon} =
    data;

  return (
    <View style={styles.content}>
      <View style={styles.header}>
        <Text style={styles.city}>{city}</Text>
        <View style={styles.temperatureContainer}>
          <Text style={styles.temperature}>{temperature}°</Text>
          <Text style={styles.condition}>{condition}</Text>
        </View>
      </View>

      <View style={styles.iconContainer}>
        {icon ? (
          <Image
            source={{uri: `https://openweathermap.org/img/wn/${icon}@2x.png`}}
            style={styles.weatherIcon}
            resizeMode="contain"
          />
        ) : (
          <Icon name={getWeatherIcon(condition)} size={80} color="#fff" />
        )}
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Icon name="thermometer-outline" size={24} color="#fff" />
          <Text style={styles.detailLabel}>Feels Like</Text>
          <Text style={styles.detailValue}>{feelsLike}°</Text>
        </View>
        <View style={styles.detailItem}>
          <Icon name="water-outline" size={24} color="#fff" />
          <Text style={styles.detailLabel}>Humidity</Text>
          <Text style={styles.detailValue}>{humidity}%</Text>
        </View>
        <View style={styles.detailItem}>
          <Icon name="wind-outline" size={24} color="#fff" />
          <Text style={styles.detailLabel}>Wind</Text>
          <Text style={styles.detailValue}>{windSpeed} m/s</Text>
        </View>
      </View>
    </View>
  );
};

const WeatherCard: React.FC<WeatherCardProps> = ({data}) => {
  return (
    <View style={styles.cardWrapper}>
      {Platform.OS === 'ios' ? (
        <BlurView
          style={styles.container}
          blurType="dark"
          blurAmount={10}
          reducedTransparencyFallbackColor="rgba(0, 0, 0, 0.7)">
          <CardContent data={data} />
        </BlurView>
      ) : (
        <View style={styles.container}>
          <CardContent data={data} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginTop: 20,
    width: width - 32,
    marginHorizontal: 16,
    borderRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  container: {
    flex: 1,
    backgroundColor: Platform.select({
      ios: 'rgba(0, 0, 0, 0.4)',
      android: 'rgba(0, 0, 0, 0.6)',
    }),
    minHeight: 500,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  city: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  temperatureContainer: {
    alignItems: 'center',
  },
  temperature: {
    fontSize: 72,
    fontWeight: '800',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  condition: {
    fontSize: 20,
    color: '#fff',
    textTransform: 'capitalize',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  weatherIcon: {
    width: 100,
    height: 100,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#fff',
    marginTop: 8,
    marginBottom: 4,
    opacity: 0.9,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
});

export default WeatherCard;
