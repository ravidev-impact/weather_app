# Weather App

A modern React Native weather application with dynamic backgrounds, search history, and daily forecasts.

## Features

- **Current Weather**: Get current weather conditions for any city in the world
- **5-Day Forecast**: View upcoming weather forecasts
- **Dynamic Backgrounds**: Background images change based on current weather conditions
- **Search History**: Automatically saves your recently searched cities
- **Elegant UI**: Clean and modern interface with weather-specific icons
- **Responsive Design**: Works well on different screen sizes
- **Platform Specific**: Uses native blur effects on iOS and custom styling on Android

## Installation

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- React Native environment set up ([React Native Setup Guide](https://reactnative.dev/docs/environment-setup))

### Setting up the project

1. Clone the repository:

```bash
git clone <repository-url>
cd WeatherApp
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Install iOS dependencies:

```bash
cd ios && pod install && cd ..
```

## Instructions to Run the App

### Development Mode

#### iOS

1. Start Metro bundler in a terminal window:

```bash
npx react-native start
```

2. In a separate terminal, run the iOS app:

```bash
npx react-native run-ios
```

You can specify a simulator:

```bash
npx react-native run-ios --simulator="iPhone 14 Pro"
```

#### Android

1. Start Metro bundler (if not already running):

```bash
npx react-native start
```

2. Make sure you have an Android emulator running or a device connected

3. In a separate terminal, run the Android app:

```bash
npx react-native run-android
```

### Production Build

#### iOS

1. Open the iOS project in Xcode:

```bash
open ios/WeatherApp.xcworkspace
```

2. Select "Product" > "Archive" to create a production build

#### Android

1. Create a production APK:

```bash
cd android
./gradlew assembleRelease
```

2. The APK will be located at:

```
android/app/build/outputs/apk/release/app-release.apk
```

### Troubleshooting

- **Metro bundler issues**: Try clearing the cache with `npx react-native start --reset-cache`
- **Build errors**: Ensure all dependencies are installed with `npm install` or `yarn install`
- **iOS build fails**: Try cleaning the build with `cd ios && xcodebuild clean && cd ..`
- **Android build fails**: Try `cd android && ./gradlew clean && cd ..`

## API Configuration

The app uses the OpenWeatherMap API. The API key is already included in the project, but if you want to use your own:

1. Register at [OpenWeatherMap](https://openweathermap.org/api) to get an API key
2. Edit `src/constants/config.ts` and replace the API_KEY value with yours

## Architectural Decisions

### Overall Architecture

The application follows a **clean architecture** approach with a clear separation of concerns:

1. **Presentation Layer**: React components in the components and screens directories render the UI and handle user interactions
2. **State Management Layer**: Redux store with Redux Toolkit manages application state
3. **Data Layer**: Services make API calls and transform data
4. **Domain Layer**: TypeScript interfaces define the shape of data

### Key Design Decisions

#### 1. Redux with Redux Toolkit

- **Why**: Provides a single source of truth for application state
- **Benefits**: Predictable state updates, time-travel debugging, middleware support
- **Implementation**: We use slices to separate concerns (weather data, search history)

#### 2. Async Storage for Persistence

- **Why**: Reliable client-side storage solution
- **Benefits**: Allows offline capabilities and improves user experience
- **Implementation**: Search history is persisted between app restarts

#### 3. Component Structure

- **Why**: Reusable components improve maintainability
- **Benefits**: DRY principle, easier testing, consistent UI
- **Implementation**: Components are organized by feature (weather, search)

#### 4. Service Pattern

- **Why**: Centralizes API calls and data transformation
- **Benefits**: Easier to mock for testing, encapsulates backend interaction logic
- **Implementation**: WeatherService handles all OpenWeatherMap API interactions

#### 5. Platform-Specific Enhancements

- **Why**: Better native feel on each platform
- **Benefits**: Improved user experience
- **Implementation**: BlurView for iOS, custom overlays for Android

#### 6. Immutable State

- **Why**: Prevents unintended side effects
- **Benefits**: Predictable debugging, improved performance
- **Implementation**: Redux Toolkit's `createSlice` uses Immer for immutable updates

#### 7. Thunks for Async Operations

- **Why**: Centralized handling of async logic
- **Benefits**: Better error handling, loading states
- **Implementation**: Fetch operations and storage operations use thunks

## Project Structure

```
src/
├── assets/             # Static assets like images
├── components/         # Reusable components
│   ├── common/         # Common UI components
│   ├── search/         # Search-related components
│   └── weather/        # Weather display components
├── constants/          # App constants, API config
├── hooks/              # Custom React hooks
├── screens/            # App screens
├── services/           # API services
├── store/              # Redux store setup
│   ├── index.ts        # Store configuration
│   ├── weatherSlice.ts # Weather state management
│   └── searchHistorySlice.ts # Search history management
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Features in Detail

### Weather Data

The app displays:

- City name and country
- Current temperature
- Weather condition with icon
- Wind speed
- Humidity
- Sunrise time (shown in Indian Standard Time)
- 4-day forecast with day, temperature, and condition

### Dynamic Backgrounds

The app changes the background image based on the current weather:

- Sunny/Clear: Bright blue sky
- Rainy: Rain droplets
- Cloudy: Cloud formations
- Snowy: Snow landscape
- Thunderstorm: Lightning strike
- Foggy/Misty: Atmospheric fog

### Search History

- Automatically saves the last 5 cities you searched for
- Allows quick re-searching of previous cities
- Persists between app launches

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Testing

The app includes a comprehensive test suite to ensure functionality and prevent regressions.

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage report
npm test -- --coverage

# Run tests in watch mode during development
npm test -- --watch
```

### Test Structure

The test suite includes:

1. **Unit Tests**: Testing individual components, services, and Redux slices

   - Services tests: Verify API interactions and data transformations
   - Redux slice tests: Ensure reducers and thunks work correctly
   - Component tests: Check rendering and user interactions

2. **Integration Tests**: Testing interactions between components
   - Verify screen components integrate correctly with Redux store
   - Test navigation and data flow

### Test Coverage

The test suite aims to cover:

- Critical user flows (search, view weather, view forecast)
- Error handling and edge cases
- Async operations (API calls, data persistence)
- State management logic

### Mocks and Fixtures

The tests use:

- Mock stores for Redux testing
- Mock services for API testing
- Mock components for dependency injection
- Test fixtures for consistent data
