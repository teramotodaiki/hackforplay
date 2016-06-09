import { combineReducers } from 'redux';
import { ADD_CHANNEL } from '../actions/';

// state { [id]: { channel object has id }, ... }
export const channels = (state = {}, action) => {
  switch (action.type) {

    case ADD_CHANNEL:

      return Object.assign({}, state, {
        [action.channel.ID]: action.channel
      });

    default:
      return state;
  }
};
