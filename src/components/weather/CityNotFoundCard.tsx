import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CityNotFoundCard: React.FC = () => {
  return (
    <View style={styles.container} testID="city-not-found-card">
      <Icon name="location-outline" size={80} color="#fff" />
      <Text style={styles.title}>City Not Found</Text>
      <Text style={styles.message}>
        We couldn't find the city you're looking for. Please check the spelling
        and try again.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default CityNotFoundCard;
