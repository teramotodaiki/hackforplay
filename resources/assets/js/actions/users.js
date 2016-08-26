import request from './request';

import { createAction } from 'redux-actions';

import createREST from './restfulActions.js';
const REST = createREST('users');

export const setUser = createAction('SET_USER');
export const mergeUser = createAction('MERGE_USER');
export const deleteUser = createAction('DELETE_USER');

export const indexUser = REST.index(setUser);
export const showUser = REST.show(setUser);
export const updateUser = REST.update(setUser);
export const storeUser = REST.store(setUser);
export const destroyUser = REST.destroy(deleteUser);

export const showUserIfNeeded =
  REST.showIfNeeded(setUser, (state) => state.users);

export const getAuthUser = () =>
  (dispatch) => {

    const meta = document.querySelector('meta[name="login-user-id"]');
    const id = +meta.getAttribute('content');
    dispatch(showUserIfNeeded({ id })); // Set {isLoading} object

    return meta ?
      dispatch(showUserIfNeeded({ id }))
        .then((result) => result.body) :
      null;

};
