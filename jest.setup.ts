import {jest} from '@jest/globals';
import type {ComponentType} from 'react';

// Mock the necessary modules for testing

// Mock for react-native-reanimated
jest.mock('react-native-reanimated', () => ({
  default: {
    call: () => {},
    createAnimatedComponent: (component: ComponentType<any>) => component,
    View: 'AnimatedView',
    Text: 'AnimatedText',
    Image: 'AnimatedImage',
    ScrollView: 'AnimatedScrollView',
    FlatList: 'AnimatedFlatList',
    useSharedValue: (initial: any) => ({value: initial}),
    useAnimatedStyle: () => ({}),
    withTiming: (toValue: any) => toValue,
    withSpring: (toValue: any) => toValue,
  },
}));

// Mock vector icons
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

// Mock the BlurView component
jest.mock('@react-native-community/blur', () => ({
  BlurView: 'BlurView',
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock the react-native/Libraries/Animated/NativeAnimatedHelper
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock the react-native/Libraries/EventEmitter/NativeEventEmitter
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

// Mock the react-native/Libraries/Components/View/ViewStylePropTypes
jest.mock('react-native/Libraries/Components/View/ViewStylePropTypes');

// Mock the react-native/Libraries/Components/Text/TextStylePropTypes
jest.mock('react-native/Libraries/Components/Text/TextStylePropTypes');

// Mock the react-native/Libraries/Components/Image/ImageStylePropTypes
jest.mock('react-native/Libraries/Components/Image/ImageStylePropTypes');

// Mock the react-native/Libraries/Components/TextInput/TextInput
jest.mock('react-native/Libraries/Components/TextInput/TextInput', () => {
  const TextInput = require('react-native').TextInput;
  return TextInput as ComponentType<any>;
});

// Mock the react-native/Libraries/Components/Image/Image
jest.mock('react-native/Libraries/Components/Image/Image', () => {
  const Image = require('react-native').Image;
  return Image as ComponentType<any>;
});
