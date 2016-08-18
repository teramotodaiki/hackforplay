import {
  ADD_CHANNEL,
  ADD_CHAT,
  PUT_QCARD_LOCAL, PUT_QCARD_ORIGIN, PUT_QCARD_BOTH
} from '../actions/';

import makeAssignRecursive from './makeAssignRecursive';
const assignRecursive = makeAssignRecursive('channel', 'chat');

// state { [id]: { channel object has id }, ... }
export const channels = (state = {}, action) => {
  switch (action.type) {

    case ADD_CHANNEL:
      return assignRecursive(state, action.channel, null);

    case ADD_CHAT:
      return assignRecursive(state, null, action.chat);

    default:
      return state;
  }
};

// state { local: { [id]: { q card object has id }, ... }, origin: { same as local } }
export const qcards = ({ local, origin } = {
  local: {},
  origin: {},
}, { type, qcard }) => {
  const node = qcard ? { [qcard.id]: qcard } : null;
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
      return { local, origin };
  }
};
