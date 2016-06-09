import { combineReducers } from 'redux';
import { ADD_CHANNEL, ADD_CHAT  } from '../actions/';

// state { [id]: { channel object has id }, ... }
export const channels = (state = {}, action) => {
  switch (action.type) {

    case ADD_CHANNEL:

      return Object.assign({}, state, {
        [action.channel.ID]: action.channel
      });

    case ADD_CHAT:

      const channel = state[action.channelId];
      if (!channel) return state;
      const merged = Object.assign({}, channel, {
        Chats: (channel.chats || []).concat(action.chat)
      });
      return Object.assign({}, state, {
        [action.channelId]: merged
      });

    default:
      return state;
  }
};
