import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import { setReducer, mergeReducer, deleteReducer } from './general';
import { setUser, mergeUser, deleteUser } from '../actions/';

export const users = handleActions({

  [setUser]: setReducer,
  [mergeUser]: mergeReducer,
  [deleteUser]: deleteReducer,

}, Map());
