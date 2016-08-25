import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import { setReducer, mergeReducer, deleteReducer } from './general';
import { setProject, mergeProject, deleteProject } from '../actions/';

export const projects = handleActions({

  [setProject]: setReducer,
  [mergeProject]: mergeReducer,
  [deleteProject]: deleteReducer,

}, Map());
