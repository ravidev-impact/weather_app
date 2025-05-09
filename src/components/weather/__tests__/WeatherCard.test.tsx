import React from 'react';
import {render} from '@testing-library/react-native';
import WeatherCard from '../WeatherCard';

const mockWeatherData = {
  city: 'London',
  temperature: 20,
  condition: 'Cloudy',
  icon: '04d',
  humidity: 75,
  windSpeed: 5.2,
  feelsLike: 18,
};

describe('WeatherCard', () => {
  it('renders correctly with weather data', () => {
    const {getByText} = render(<WeatherCard data={mockWeatherData} />);

    // Check if city name is rendered
    expect(getByText('London')).toBeTruthy();

    // Check if temperature is rendered
    expect(getByText('20°C')).toBeTruthy();

    // Check if weather condition is rendered
    expect(getByText('Cloudy')).toBeTruthy();

    // Check if weather details are rendered
    expect(getByText('Feels Like')).toBeTruthy();
    expect(getByText('18°C')).toBeTruthy();
    expect(getByText('Humidity')).toBeTruthy();
    expect(getByText('75%')).toBeTruthy();
    expect(getByText('Wind')).toBeTruthy();
    expect(getByText('5.2 m/s')).toBeTruthy();
  });

  it('renders weather icon', () => {
    const {getByTestId} = render(<WeatherCard data={mockWeatherData} />);
    const weatherIcon = getByTestId('weather-icon');
    expect(weatherIcon).toBeTruthy();
    expect(weatherIcon.props.source.uri).toBe(
      `https://openweathermap.org/img/wn/${mockWeatherData.icon}@2x.png`,
    );
  });
});
