import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import { setReducer, mergeReducer, deleteReducer } from './general';
import { setStage, mergeStage, deleteStage } from '../actions/';

export const stages = handleActions({

  [setStage]: setReducer,
  [mergeStage]: mergeReducer,
  [deleteStage]: deleteReducer,

}, Map());
