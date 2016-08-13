

import {
  REQUEST_STAGE, RESPONSE_STAGE,
  REQUEST_PROJECT, RESPONSE_PROJECT,
  REQUEST_USER, RESPONSE_USER,
} from '../actions/';

const removeItem = (obj, key) => {
  const filtered = Object.keys(obj)
    .filter((_key) => _key !== key)
    .map((key) => { return { [key]: obj[key] }; });

  return Object.assign({}, filtered);
};

export const fetchings = (state = {
  stages: {},
  projects: {},
  users: {},
}, action) => {
  switch (action.type) {
    case REQUEST_PROJECT:

      return Object.assign({}, state, {
        projects: Object.assign({}, state.projects, {
          [action.project.id]: Object.assign({ isFetching: true }, action.project)
        })
      });

    case RESPONSE_PROJECT:

      return Object.assign({}, state, {
        projects: removeItem(state.projects, action.project.id)
      });

    case REQUEST_STAGE:

      return Object.assign({}, state, {
        stages: Object.assign({}, state.stages, {
          [action.stage.id]: Object.assign({ isFetching: true }, action.stage)
        })
      });

    case RESPONSE_STAGE:

      return Object.assign({}, state, {
        stages: removeItem(state.stages, action.stage.id)
      });

    case REQUEST_USER:

      return Object.assign({}, state, {
        users: Object.assign({}, state.users, {
          [action.user.id]: Object.assign({ isFetching: true }, action.user)
        })
      });

    case RESPONSE_USER:

      return Object.assign({}, state, {
        users: removeItem(state.users, action.user.id)
      });


    default:
      return state;
  }
};
