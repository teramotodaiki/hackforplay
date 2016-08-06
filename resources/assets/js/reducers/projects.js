/**
 * projects
 * |  \ ...
 * {project}
 *  |
 * stages
 *    | \ ...
 *  {stage}
*/

import { ADD_PROJECT, ADD_STAGE } from '../actions/';
import makeAssignRecursive from './makeAssignRecursive';

const assignRecursive = makeAssignRecursive('project', 'stage');

export const projects = (state = {}, action) => {
  switch (action.type) {

    case ADD_PROJECT:

      return assignRecursive(state, action.project, null)

    case ADD_STAGE:

      return assignRecursive(state, null, action.stage)

    default:
      return state;
  }
};
