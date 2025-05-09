import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SearchHistoryState {
  lastSearchedCity: string | null;
  searchHistory: string[];
}

const initialState: SearchHistoryState = {
  lastSearchedCity: null,
  searchHistory: [],
};

const searchHistorySlice = createSlice({
  name: 'searchHistory',
  initialState,
  reducers: {
    setLastSearchedCity: (state, action: PayloadAction<string>) => {
      state.lastSearchedCity = action.payload;
      // Add to search history if not already present
      if (!state.searchHistory.includes(action.payload)) {
        state.searchHistory = [action.payload, ...state.searchHistory].slice(
          0,
          5,
        ); // Keep last 5 searches
      }
      // Save to AsyncStorage
      AsyncStorage.setItem('lastSearchedCity', action.payload);
      AsyncStorage.setItem(
        'searchHistory',
        JSON.stringify(state.searchHistory),
      );
    },
    loadSavedHistory: (
      state,
      action: PayloadAction<{lastCity: string | null; history: string[]}>,
    ) => {
      state.lastSearchedCity = action.payload.lastCity;
      state.searchHistory = action.payload.history;
    },
  },
});

export const {setLastSearchedCity, loadSavedHistory} =
  searchHistorySlice.actions;
export default searchHistorySlice.reducer;
