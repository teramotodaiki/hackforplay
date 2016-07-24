import request from './request';


export const ADD_USER = 'ADD_USER';

export const addUser = (user) => {
  return { type: ADD_USER, user };
};

export const fetchUser = (id) => {
  return (dispatch) => {

    return request
      .get('/api/users/' + id)
      .then((result) => {
        dispatch({ type: ADD_USER, user: result.body });
        return result;
      });
      
  };
};
