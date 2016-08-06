/**
 * plays
 *  |
 * {play} -> {stage}
 *
 */

import { ADD_PLAY } from '../actions/';

export const plays = (state = {}, action) => {

  switch (action.type) {
    case ADD_PLAY:

      return Object.assign({}, state, {
        [action.play.id]: action.play
      });

    default:
      return state;
  }

};
