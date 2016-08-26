import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import { setReducer, mergeReducer, deleteReducer } from './general';
import { setChat, mergeChat, deleteChat } from '../actions/';

export const chats = handleActions({

  [setChat]: setReducer,
  [mergeChat]: mergeReducer,
  [deleteChat]: deleteReducer,

}, Map());
