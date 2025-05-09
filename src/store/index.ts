import {configureStore} from '@reduxjs/toolkit';
import weatherReducer from './weatherSlice';
import searchHistoryReducer from './searchHistorySlice';

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    searchHistory: searchHistoryReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
