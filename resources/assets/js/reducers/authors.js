import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import { setReducer, mergeReducer, deleteReducer } from './general';
import { setAuthor, mergeAuthor, deleteAuthor } from '../actions/';

export const authors = handleActions({

  [setAuthor]: setReducer,
  [mergeAuthor]: mergeReducer,
  [deleteAuthor]: deleteReducer,

}, Map());
