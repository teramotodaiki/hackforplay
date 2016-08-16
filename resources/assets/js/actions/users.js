import request from './request';


export const ADD_USER = 'ADD_USER';
export const REQUEST_USER = 'REQUEST_USER';
export const RESPONSE_USER = 'RESPONSE_USER';

export const addUser = (user) => {
  return { type: ADD_USER, user };
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

export const postUser = (user) => {
  return (dispatch) => {

    return request
      .post('/api/users')
      .send(user)
      .then((result) => {
        dispatch({ type: ADD_USER, user })
        return result;
      });
      
  };
}

const fetchUserById = ({ id, dispatch, responseType }) => {

  return {
    result: dispatch({ type: REQUEST_USER, user: { id }}),
    promise: request
      .get('/api/users/' + id)
      .then((result) => {
        dispatch({ type: ADD_USER, user: result.body });
        dispatch({ type: RESPONSE_USER, user: result.body });
        return result;
      })
  }[responseType];

};

export const fetchUser = (id) => {
  return (dispatch) => {
    return fetchUserById({ id, dispatch, responseType: 'promise' });
  };
};

const findUser = (id, getState) => {
  const { users, fetchings } = getState();
  return users[id] || fetchings.users[id];
};

export const fetchUserIfNeeded = (id) => {
  return (dispatch, getState) => {
    const user = findUser(id, getState);
    return user ? Promise.resolve({ body: user }) :
      fetchUserById({ id, dispatch, responseType: 'result' });
  }
};

export const getUserFromLocal = (id) => {
  return (dispatch, getState) => {
    return findUser(id, getState) || { id };
  };
};
