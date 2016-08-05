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


export const projects = (state = {}, action) => {
  switch (action.type) {

    case ADD_PROJECT:

      return Object.assign({}, state, {
        [action.project.id]: assignRecursive({}, action.project)
      });

    case ADD_STAGE:

      const projectId = action.stage.project_id;
      const project = state[projectId] || { id: projectId };

      return Object.assign({}, state, {
        [project.id]: assignRecursive(project, null, action.stage)
      });

    default:
      return state;
  }
};

const assignRecursive = (source, project, stage) => {
  return Object.assign({}, source, project, {
    stages: Object.assign({}, source.stages, stage && {
      [stage.id]: stage,
    })
  });
};
