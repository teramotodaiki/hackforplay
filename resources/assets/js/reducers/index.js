import { combineReducers } from 'redux';
import { ADD_CHANNEL } from '../actions/';

const initialState = {
  test: true,
  channels: [],
};

export const channel = (state = initialState, action) => {
  switch (action.type) {
    
    case ADD_CHANNEL:
      return Object.assign({}, state, {
        channels: [
          ...state.channels,
          action.channel
        ]
      });

    default:
      return state;
  }
};
