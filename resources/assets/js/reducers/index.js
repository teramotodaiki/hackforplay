import { combineReducers } from 'redux';
import { ADD_CHANNEL, ADD_CHAT, PUT_QCARD_LOCAL, PUT_QCARD_ORIGIN, PUT_QCARD_BOTH  } from '../actions/';

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

// state { local: { [id]: { q card object has id }, ... }, origin: { same as local } }
export const qcards = ({ local, origin } = {
  local: {},
  origin: {},
}, { type, qcard }) => {
  const node = { [qcard.id]: qcard };
  switch (type) {
    case PUT_QCARD_LOCAL:

      local = Object.assign({}, local, node);
      return { local, origin };

    case PUT_QCARD_ORIGIN:

      origin = Object.assign({}, origin, node);
      return { local, origin };

    case PUT_QCARD_BOTH:

      local = Object.assign({}, local, node);
      origin = Object.assign({}, origin, node);
      return { local, origin };

    default:
      return state;
  }
};
