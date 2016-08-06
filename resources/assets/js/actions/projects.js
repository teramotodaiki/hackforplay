import request from './request';


export const ADD_PROJECT = 'ADD_PROJECT';
export const REQUEST_PROJECT = 'REQUEST_PROJECT';
export const RESPONSE_PROJECT = 'RESPONSE_PROJECT';
export const ADD_STAGE = 'ADD_STAGE';
export const REQUEST_STAGE = 'REQUEST_STAGE';
export const RESPONSE_STAGE = 'RESPONSE_STAGE';

export const addProject = (project) => {
  return { type: ADD_PROJECT, project };
};

export const fetchProject = (id) => {
  return (dispatch) => {

    return request
      .get('/api/projects/' + id)
      .then((result) => {
        dispatch({ type: ADD_PROJECT, project: result.body });
        return result;
      });

  }
};

export const addStage = (stage) => {
  return { type: ADD_STAGE, stage };
};

const fetchStageById = ({ id, dispatch, responseType }) => {

  return {
    result: dispatch({ type: REQUEST_STAGE, stage: { id } }).stage,
    promise: request
      .get('/api/stages/' + id)
      .then((result) => {
        dispatch({ type: ADD_STAGE, stage: result.body });
        dispatch({ type: RESPONSE_STAGE, stage: result.body });
        return result;
      })
  }[responseType];

};

export const fetchStage = (id) => {
  return (dispatch) => {
    return fetchStageById({ id, dispatch, responseType: 'promise' });
  };
};

export const fetchStageIfNeeded = (id) => {
  return (dispatch, getState) => {

    const { projects, fetchings } = getState();

    const stage =
      Object.values(projects)
        .reduce((p, c) => {
          return Object.assign({}, p.stages, c.stages);
        }, {})[id] ||
      fetchings.stages[id] ||
      fetchStageById({ id, dispatch, responseType: 'result' });

    return stage;
  };
};
