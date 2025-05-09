import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CityNotFoundCard: React.FC = () => {
  return (
    <View style={styles.container}>
      <Icon name="location" size={64} color="#fff" style={styles.icon} />
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default CityNotFoundCard;
