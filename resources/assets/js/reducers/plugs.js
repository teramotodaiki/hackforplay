import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import { setReducer, mergeReducer, deleteReducer } from './general';
import { setPlug, mergePlug, deletePlug } from '../actions/';

export const plugs = handleActions({

  [setPlug]: setReducer,
  [mergePlug]: mergeReducer,
  [deletePlug]: deleteReducer,

}, Map());
