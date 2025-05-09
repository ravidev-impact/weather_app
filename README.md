# Weather App

A modern, efficient weather application built with React Native that provides real-time weather information for any city.

## Features

- Search for weather by city name
- Display current temperature and weather conditions
- Persistent storage of last searched city
- Dark mode support
- Cross-platform compatibility (iOS & Android)
- Error handling and loading states
- Clean, modern UI

## Tech Stack

- React Native
- TypeScript
- Redux Toolkit for state management
- OpenWeatherMap API
- React Navigation
- AsyncStorage for persistence
- Jest for testing

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── screens/        # Screen components
  ├── services/       # API and external service integrations
  ├── store/          # Redux store configuration
  ├── hooks/          # Custom React hooks
  ├── utils/          # Helper functions and utilities
  ├── constants/      # App-wide constants
  └── types/          # TypeScript type definitions
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your OpenWeatherMap API key:
   ```
   OPENWEATHER_API_KEY=your_api_key_here
   ```
4. For iOS, install pods:
   ```bash
   cd ios && pod install && cd ..
   ```
5. Start the development server:
   ```bash
   npm start
   ```
6. Run on iOS:
   ```bash
   npm run ios
   ```
7. Run on Android:
   ```bash
   npm run android
   ```

## Testing

Run the test suite:

```bash
npm test
```

## Architecture Decisions

1. **State Management**: Redux Toolkit was chosen for its simplicity, built-in immutability, and excellent TypeScript support.

2. **API Integration**: Centralized API calls in a service layer for better maintainability and reusability.

3. **Component Structure**: Components are organized by feature and common components, following the Single Responsibility Principle.

4. **TypeScript**: Used throughout the project for better type safety and developer experience.

5. **Styling**: Modular styling approach using StyleSheet for better performance and maintainability.

6. **Error Handling**: Comprehensive error handling with user-friendly error messages.

7. **Testing**: Jest and React Native Testing Library for unit and integration tests.

## Performance Considerations

- Implemented proper memoization for expensive computations
- Optimized re-renders using React.memo and useMemo
- Efficient state management to prevent unnecessary updates
- Proper error boundaries for graceful error handling
- Lazy loading of components where appropriate

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
