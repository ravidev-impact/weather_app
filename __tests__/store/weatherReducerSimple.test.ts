import weatherReducer, {
  clearError,
  setLastSearchedCity,
} from '../../src/store/weatherSlice';

describe('Weather Reducer', () => {
  it('should return the initial state', () => {
    expect(weatherReducer(undefined, {type: ''})).toEqual({
      data: null,
      loading: false,
      error: null,
      lastSearchedCity: null,
    });
  });

  it('should handle clearError', () => {
    const initialState = {
      data: null,
      loading: false,
      error: 'Some error',
      lastSearchedCity: null,
    };

    expect(weatherReducer(initialState, clearError())).toEqual({
      data: null,
      loading: false,
      error: null,
      lastSearchedCity: null,
    });
  });

  it('should handle setLastSearchedCity', () => {
    const initialState = {
      data: null,
      loading: false,
      error: null,
      lastSearchedCity: null,
    };

    expect(weatherReducer(initialState, setLastSearchedCity('London'))).toEqual(
      {
        data: null,
        loading: false,
        error: null,
        lastSearchedCity: 'London',
      },
    );
  });
});
