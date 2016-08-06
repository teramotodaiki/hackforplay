

import { REQUEST_STAGE } from '../actions/';


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

      break;
    default:
      return state;
  }
};
