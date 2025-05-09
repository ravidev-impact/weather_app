import configureStore from 'redux-mock-store';
import {thunk} from 'redux-thunk';
import {AnyAction} from '@reduxjs/toolkit';

// Create a type-safe mock store factory
const mockStoreCreator = configureStore<any, AnyAction>([thunk as any]);

export default mockStoreCreator;
