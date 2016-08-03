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
import getKeyValueObject from './getKeyValueObject';


export const projects = (state = {}, action) => {
  switch (action.type) {

    case ADD_PROJECT:

      return Object.assign({}, state, {
        [project.id]: Object.assign({}, action.project, {
          stages: composedStages({
            project: state[action.project_id],
            array: action.project.stages
          })
        })
      });

    case ADD_STAGE:

      const projectId = action.stage.project_id;
      const project = state[projectId] || { id: projectId };

      return Object.assign({}, state, {
        [project.id]: Object.assign({}, project, {
          stages: composedStages({
            project: project,
            stage: action.stage
          })
        })
      });

    default:
      return state;
  }
};

const composedStages = ({ project = {}, array = [], stage = {} }) => {
  return Object.assign({},
   'stages' in project ? project.stages : {},
   array ? getKeyValueObject.apply(null, array) : {},
   'id' in stage ? { [stage.id]: stage } : {}
  );
}
