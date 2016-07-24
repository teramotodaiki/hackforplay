import request from './request';


export const ADD_PROJECT = 'ADD_PROJECT';
export const ADD_STAGE = 'ADD_STAGE';


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

export const fetchStage = (id) => {
  return (dispatch) => {

    return request
      .get('/api/stages/' + id)
      .then((result) => {
        dispatch({ type: ADD_STAGE, stage: result.body });
        return result;
      });

  }
};