import request from './request';


export const ADD_USER = 'ADD_USER';
export const REQUEST_USER = 'REQUEST_USER';
export const RESPONSE_USER = 'RESPONSE_USER';

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

export const getAuthUser = () => {
  return (dispatch, getState) => {

    const meta = document.querySelector('meta[name="login-user-id"]');
    const user_id = meta ? meta.getAttribute('content') : null;
    if (!user_id) return Promise.reject();

    return getState().users[user_id] ?
      Promise.resolve(getState().users[user_id]) :
      dispatch(fetchUser(user_id))
      .then((result) => result.body);

  };
};
