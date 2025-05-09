import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {WeatherData} from '../../types/weather';

interface WeatherCardProps {
  data: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({data}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.cityName}>{data.city}</Text>
      <View style={styles.temperatureContainer}>
        <Text style={styles.temperature}>{data.temperature}°C</Text>
        <Image
          testID="weather-icon"
          source={{
            uri: `https://openweathermap.org/img/wn/${data.icon}@2x.png`,
          }}
          style={styles.weatherIcon}
        />
      </View>
      <Text style={styles.condition}>{data.condition}</Text>
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Feels Like</Text>
          <Text style={styles.detailValue}>{data.feelsLike}°C</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Humidity</Text>
          <Text style={styles.detailValue}>{data.humidity}%</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Wind</Text>
          <Text style={styles.detailValue}>{data.windSpeed} m/s</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cityName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
    marginRight: 8,
  },
  weatherIcon: {
    width: 64,
    height: 64,
  },
  condition: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 16,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default WeatherCard;
