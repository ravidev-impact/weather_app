import AsyncStorage from '@react-native-async-storage/async-storage';
import searchHistoryReducer, {
  setLastSearchedCity,
  loadSavedHistory,
  clearSearchHistoryError,
  loadSearchHistory,
  saveSearchHistory,
} from '../../src/store/searchHistorySlice';
import mockStore from '../utils/mockStore';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  multiSet: jest.fn(),
  multiGet: jest.fn(),
}));

describe('Search History Slice', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test the reducer
  describe('reducer', () => {
    it('should return the initial state', () => {
      expect(searchHistoryReducer(undefined, {type: ''})).toEqual({
        lastSearchedCity: null,
        searchHistory: [],
        loading: false,
        error: null,
      });
    });

    it('should handle setLastSearchedCity', () => {
      const initialState = {
        lastSearchedCity: null,
        searchHistory: [],
        loading: false,
        error: null,
      };

      const cityName = 'London';
      expect(
        searchHistoryReducer(initialState, setLastSearchedCity(cityName)),
      ).toEqual({
        lastSearchedCity: cityName,
        searchHistory: [cityName],
        loading: false,
        error: null,
      });
    });

    it('should add to history and maintain order', () => {
      const initialState = {
        lastSearchedCity: 'Paris',
        searchHistory: ['Paris', 'Berlin', 'Tokyo'],
        loading: false,
        error: null,
      };

      // Adding a new city
      const newState = searchHistoryReducer(
        initialState,
        setLastSearchedCity('London'),
      );
      expect(newState.searchHistory).toEqual([
        'London',
        'Paris',
        'Berlin',
        'Tokyo',
      ]);

      // Adding a city that's already in the list should move it to the front
      const updatedState = searchHistoryReducer(
        newState,
        setLastSearchedCity('Berlin'),
      );
      expect(updatedState.searchHistory).toEqual([
        'Berlin',
        'London',
        'Paris',
        'Tokyo',
      ]);
    });

    it('should limit history to 5 items', () => {
      const initialState = {
        lastSearchedCity: 'Rome',
        searchHistory: ['Rome', 'Paris', 'Berlin', 'Tokyo', 'Madrid'],
        loading: false,
        error: null,
      };

      const newState = searchHistoryReducer(
        initialState,
        setLastSearchedCity('London'),
      );
      expect(newState.searchHistory.length).toBe(5);
      expect(newState.searchHistory).toEqual([
        'London',
        'Rome',
        'Paris',
        'Berlin',
        'Tokyo',
      ]);
      // Madrid should be dropped
    });

    it('should handle loadSavedHistory', () => {
      const initialState = {
        lastSearchedCity: null,
        searchHistory: [],
        loading: false,
        error: null,
      };

      const savedData = {
        lastCity: 'London',
        history: ['London', 'Paris', 'Berlin'],
      };

      expect(
        searchHistoryReducer(initialState, loadSavedHistory(savedData)),
      ).toEqual({
        lastSearchedCity: savedData.lastCity,
        searchHistory: savedData.history,
        loading: false,
        error: null,
      });
    });

    it('should handle clearSearchHistoryError', () => {
      const initialState = {
        lastSearchedCity: 'London',
        searchHistory: ['London'],
        loading: false,
        error: 'Some error message',
      };

      expect(
        searchHistoryReducer(initialState, clearSearchHistoryError()),
      ).toEqual({
        lastSearchedCity: 'London',
        searchHistory: ['London'],
        loading: false,
        error: null,
      });
    });
  });

  // Test the thunks
  describe('saveSearchHistory thunk', () => {
    it('should save the history to AsyncStorage', async () => {
      const city = 'London';
      const history = ['London', 'Paris', 'Berlin'];

      const store = mockStore({
        searchHistory: {
          lastSearchedCity: city,
          searchHistory: history,
          loading: false,
          error: null,
        },
      });

      await store.dispatch(saveSearchHistory({city, history}) as any);

      // Check if AsyncStorage.setItem was called correctly
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'lastSearchedCity',
        city,
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'searchHistory',
        JSON.stringify(history),
      );

      // Check actions
      const actions = store.getActions();
      expect(actions[0].type).toEqual(saveSearchHistory.pending.type);
      expect(actions[1].type).toEqual(saveSearchHistory.fulfilled.type);
    });
  });

  describe('loadSearchHistory thunk', () => {
    it('should load history from AsyncStorage', async () => {
      const city = 'London';
      const history = ['London', 'Paris', 'Berlin'];

      // Mock AsyncStorage getItem
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === 'lastSearchedCity') return Promise.resolve(city);
        if (key === 'searchHistory')
          return Promise.resolve(JSON.stringify(history));
        return Promise.resolve(null);
      });

      const store = mockStore({
        searchHistory: {
          lastSearchedCity: null,
          searchHistory: [],
          loading: false,
          error: null,
        },
      });

      await store.dispatch(loadSearchHistory() as any);

      // Check actions
      const actions = store.getActions();
      expect(actions[0].type).toEqual(loadSearchHistory.pending.type);
      expect(actions[1].type).toEqual(loadSearchHistory.fulfilled.type);
      expect(actions[1].payload).toEqual({
        lastCity: city,
        history: history,
      });
    });

    it('should handle empty AsyncStorage values', async () => {
      // Mock AsyncStorage getItem to return null
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const store = mockStore({
        searchHistory: {
          lastSearchedCity: null,
          searchHistory: [],
          loading: false,
          error: null,
        },
      });

      await store.dispatch(loadSearchHistory() as any);

      // Check actions
      const actions = store.getActions();
      expect(actions[1].payload).toEqual({
        lastCity: null,
        history: [],
      });
    });
  });
});
