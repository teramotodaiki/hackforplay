import request from './request';


export const ADD_AUTHOR = 'ADD_AUTHOR';
export const ADD_PLUG = 'ADD_PLUG';


export const addAuthor = (author) => {
  return { type: ADD_AUTHOR, author };
};

export const fetchAuthor = (id) => {
  return (dispatch) => {

    return request
      .get('/api/authors/' + id)
      .then((result) => {
        dispatch({ type: ADD_AUTHOR, author: result.body });
        return result;
      });

  }
};


export const addPlug = (plug) => {
  return { type: ADD_PLUG, plug };
};

export const fetchPlug = (id) => {
  return (dispatch) => {

    return request
      .get('/api/plugs/' + id)
      .then((result) => {
        dispatch({ type: ADD_PLUG, plug: result.body });
        return result;
      });

  }
};

export const fetchPlugs = ({ page } = { page: 1 }) => {
  return (dispatch) => {

    return request
      .get('/api/plugs')
      .then((result) => {
        result.body.data.forEach((item) => dispatch({ type: ADD_PLUG, plug: item }));
        return result;
      });

  };
};

export const getPlugs = () => {
  return (dispatch, getState) => {
    return Array.prototype.concat.apply([],
      Object.values(getState().authors).map((author) => Object.values(author.plugs))
    );
  };
};

export const updatePlug = (id, change) => {
  return (dispatch, getState) => {
    request.post('/api/plugs/' + id)
      .send({ _method: 'PUT' })
      .send(change)
      .then((result) => {
        dispatch({ type: ADD_PLUG, plug: result.body });
        return result;
      });
  };
};
