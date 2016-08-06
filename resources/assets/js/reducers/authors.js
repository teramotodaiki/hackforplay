/**
 *  authors
 *    | \
 *  {author}
 *      |
 *    plugs
 *      | \ ...
 *    {plug}
*/

import { ADD_AUTHOR, ADD_PLUG } from '../actions/';
import makeAssignRecursive from './makeAssignRecursive';

const assignRecursive = makeAssignRecursive('author', 'plug');

export const authors = (state = {}, action) => {
  switch (action.type) {

    case ADD_AUTHOR:
      return assignRecursive(state, action.author, null);

    case ADD_PLUG:
      return assignRecursive(state, null, action.plug);

    default:
      return state;
  }
};
