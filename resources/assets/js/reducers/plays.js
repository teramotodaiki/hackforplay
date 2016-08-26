import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import { setReducer, mergeReducer, deleteReducer } from './general';
import { setPlay, mergePlay, deletePlay } from '../actions/';

export const plays = handleActions({

  [setPlay]: setReducer,
  [mergePlay]: mergeReducer,
  [deletePlay]: deleteReducer,

}, Map());
