/**
 * users
 *  | \ ...
 * {user}
*/

import { ADD_USER } from '../actions/';

export const users = (state = {}, action) => {
  switch (action.type) {
    
    case ADD_USER:

      return Object.assign({}, state, {
        [action.user.id]: action.user
      });

    default:
      return state;
  }
};
