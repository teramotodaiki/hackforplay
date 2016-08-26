import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import { setReducer, mergeReducer, deleteReducer } from './general';
import { setChannel, mergeChannel, deleteChannel } from '../actions/';

export const channels = handleActions({

  [setChannel]: setReducer,
  [mergeChannel]: mergeReducer,
  [deleteChannel]: deleteReducer,

}, Map());
