import {createSlice, PayloadAction, createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SearchHistoryState {
  lastSearchedCity: string | null;
  searchHistory: string[];
  loading: boolean;
  error: string | null;
}

const initialState: SearchHistoryState = {
  lastSearchedCity: null,
  searchHistory: [],
  loading: false,
  error: null,
};

// Thunk for saving search history
export const saveSearchHistory = createAsyncThunk(
  'searchHistory/saveSearchHistory',
  async ({city, history}: {city: string; history: string[]}) => {
    try {
      await Promise.all([
        AsyncStorage.setItem('lastSearchedCity', city),
        AsyncStorage.setItem('searchHistory', JSON.stringify(history)),
      ]);
      return {success: true};
    } catch (error) {
      console.error('Failed to save search history', error);
      return {success: false};
    }
  },
);

// Thunk for loading saved history
export const loadSearchHistory = createAsyncThunk(
  'searchHistory/loadSearchHistory',
  async () => {
    try {
      const [lastCity, historyJson] = await Promise.all([
        AsyncStorage.getItem('lastSearchedCity'),
        AsyncStorage.getItem('searchHistory'),
      ]);

      const history = historyJson ? JSON.parse(historyJson) : [];
      return {lastCity, history};
    } catch (error) {
      console.error('Failed to load search history', error);
      return {lastCity: null, history: []};
    }
  },
);

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
    },
    loadSavedHistory: (
      state,
      action: PayloadAction<{lastCity: string | null; history: string[]}>,
    ) => {
      state.lastSearchedCity = action.payload.lastCity;
      state.searchHistory = action.payload.history;
    },
    clearSearchHistoryError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Save history
      .addCase(saveSearchHistory.pending, state => {
        state.loading = true;
      })
      .addCase(saveSearchHistory.fulfilled, state => {
        state.loading = false;
      })
      .addCase(saveSearchHistory.rejected, state => {
        state.loading = false;
        state.error = 'Failed to save search history';
      })
      // Load history
      .addCase(loadSearchHistory.pending, state => {
        state.loading = true;
      })
      .addCase(loadSearchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.lastSearchedCity = action.payload.lastCity;
        state.searchHistory = action.payload.history;
      })
      .addCase(loadSearchHistory.rejected, state => {
        state.loading = false;
        state.error = 'Failed to load search history';
      });
  },
});

export const {setLastSearchedCity, loadSavedHistory, clearSearchHistoryError} =
  searchHistorySlice.actions;
export default searchHistorySlice.reducer;
