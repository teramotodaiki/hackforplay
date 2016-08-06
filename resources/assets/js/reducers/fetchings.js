

import { REQUEST_STAGE, RESPONSE_STAGE } from '../actions/';


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

      const filtered = Object.values(state.stages)
        .filter((stage) => stage.id !== action.stage.id)
        .map((stage) => { return { [`${stage.id}`]: stage }; })

      return Object.assign({}, state, {
        stages: Object.assign.apply(null, filtered)
      });

    default:
      return state;
  }
};
