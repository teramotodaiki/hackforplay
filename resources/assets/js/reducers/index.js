import { combineReducers } from 'redux';
import { ADD_CHANNEL, ADD_CHAT, ADD_QCARD  } from '../actions/';

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
        chats: (channel.chats || []).concat(action.chat)
      });
      return Object.assign({}, state, {
        [action.channelId]: merged
      });

    default:
      return state;
  }
};

// state { [id]: { q card object has id }, ... }]
const defaultQcard = {
  article: {},
};
export const qcards = (state = {}, { type, qcard }) => {
  switch (type) {
    case ADD_QCARD:

      return Object.assign({}, state, {
        [qcard.id]: Object.assign({}, defaultQcard, qcard)
      });

      break;
    case UPDATE_QCARD:

      return Object.assign({}, state, {
        [qcard.id]: Object.assign({}, state[qcard.id], qcard)
      });

      break;
    default:
      return state;
  }
};
