import {jest} from '@jest/globals';
import type {ComponentType} from 'react';

// Mock the react-native-reanimated library
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

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
