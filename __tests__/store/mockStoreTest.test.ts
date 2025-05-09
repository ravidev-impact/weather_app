import mockStore from '../utils/mockStore';
import {createAction} from '@reduxjs/toolkit';

describe('Mock Store', () => {
  it('should create a mock store and handle actions', () => {
    // Create a mock action
    const testAction = createAction<string>('test/action');

    // Create a mock store
    const store = mockStore({
      test: {
        value: null,
      },
    });

    // Dispatch an action
    store.dispatch(testAction('test value'));

    // Check the dispatched actions
    const actions = store.getActions();
    expect(actions).toHaveLength(1);
    expect(actions[0].type).toBe('test/action');
    expect(actions[0].payload).toBe('test value');
  });
});
