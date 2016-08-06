

import { REQUEST_STAGE, RESPONSE_STAGE } from '../actions/';

const removeItem = (obj, key) => {
  const filtered = Object.keys(obj)
    .filter((_key) => _key !== key)
    .map((key) => { return { [key]: obj[key] }; });

  return Object.assign(null, filtered);
};

export const fetchings = (state = {
  stages: {}
}, action) => {
  switch (action.type) {
    case REQUEST_STAGE:

      return Object.assign({}, state, {
        stages: Object.assign({}, state.stages, {
          [action.stage.id]: Object.assign({ isFetching: true }, action.stage)
        })
      });

    case RESPONSE_STAGE:

      return Object.assign({}, state, {
        stages: removeItem(state.stages, action.stages.id)
      });

    default:
      return state;
  }
};
