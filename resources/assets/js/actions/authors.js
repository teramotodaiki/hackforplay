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
        console.log(result);
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
