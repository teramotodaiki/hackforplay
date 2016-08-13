import request from './request';


export const ADD_PROJECT = 'ADD_PROJECT';
export const REQUEST_PROJECT = 'REQUEST_PROJECT';
export const RESPONSE_PROJECT = 'RESPONSE_PROJECT';
export const ADD_STAGE = 'ADD_STAGE';
export const UPDATE_STAGE = 'UPDATE_STAGE';
export const REQUEST_STAGE = 'REQUEST_STAGE';
export const RESPONSE_STAGE = 'RESPONSE_STAGE';

export const addProject = (project) => {
  return { type: ADD_PROJECT, project };
};

const fetchProjectById = ({ id, dispatch, responseType }) => {

  return {
    result: dispatch({ type: REQUEST_PROJECT, project: { id }}),
    promise: request
      .get('/api/projects/' + id)
      .then((result) => {
        dispatch({ type: ADD_PROJECT, project: result.body });
        dispatch({ type: RESPONSE_PROJECT, project: result.body });
        return result;
      })
  }[responseType];

};

export const fetchProject = (id) => {
  return (dispatch) => {
    return fetchProjectById({ id, dispatch, responseType: 'promise' });
  };
};

const findProject = (id, getState) => {
  const { projects, fetchings } = getState();
  return projects[id] && projects[id].token ? projects[id] : fetchings.projects[id];
};

export const fetchProjectIfNeeded = (id) => {
  return (dispatch, getState) => {
    const project = findProject(id, getState);
    return project ? Promise.resolve({ body: project }) :
      fetchProjectById({ id, dispatch, responseType: 'promise' });
  }
};

export const getProjectFromLocal = (id) => {
  return (dispatch, getState) => {
    return findProject(id, getState) || { id };
  };
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

const findStage = (id, getState) => {
  const { projects, fetchings } = getState();
  const stages = Object.assign.apply(null, [{}].concat(
    Object.values(projects).map((project) => project.stages)
  ));

  return stages[id] || fetchings.stages[id] || null;
};

export const fetchStageIfNeeded = (id) => {
  return (dispatch, getState) => {
    const stage = findStage(id, getState);
    return stage ?
      Promise.resolve({ body: stage }) :
      fetchStageById({ id, dispatch, responseType: 'promise' });
  };
};

export const getStageFromLocal = (id) => {
  return (dispatch, getState) => {
    return findStage(id, getState) || { id };
  };
};

export const updateStage = (id, change) => {
  return (dispatch, getState) => {
    request.post('/api/stages/' + id)
      .send({ _method: 'PUT' })
      .send(change)
      .then((result) => {
        dispatch({ type: ADD_STAGE, stage: result.body });
        return result;
      });
  };
};
