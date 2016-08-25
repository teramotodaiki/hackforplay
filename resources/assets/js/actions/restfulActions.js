import { createAction } from 'redux-actions';
import request from './request';

export default (name) => {

  const prefix = `/api/${name}`;

  const index = (action) =>
    ({ page = 1 } = {}) =>
      (dispatch) =>
        request
          .get(prefix)
          .query({ page })
          .then((result) => {
            result.body.data.forEach((payload) => dispatch(action(payload)));
            return result;
          });

  const show = (action) =>
    ({ id }) =>
      (dispatch) => {
        dispatch(action({ id, isLoading: true }));
        return request
          .get(prefix + '/' + id)
          .then((result) => {
            dispatch(action(result.body));
            return result;
          });
      };

  const update = (action) =>
    (id, change) =>
      (dispatch) =>
        request
          .put(prefix + '/' + id)
          .send(change)
          .then((result) => {
            dispatch(action(result.body));
            return result;
          });

  const store = (action) =>
    (payload) =>
      (dispatch) =>
        request
          .post(prefix)
          .send(payload)
          .then((result) => {
            dispatch(action(result.body));
            return result;
          });

  const destroy = (action) =>
    ({ id }) =>
      (dispatch) =>
        request
          .del(prefix + '/' + id)
          .then((result) => {
            dispatch(action({ id }));
            return result;
          });

  const showIfNeeded = (action, selector) =>
    ({ id }) =>
      (dispatch, getState) => {
        const state = selector(getState());
        return state.has(id) ?
          Promise.resolve({ body: state.get(id) }) :
          dispatch(show(action)({ id }));
      };

  return {
    index,
    show,
    update,
    store,
    destroy,
    showIfNeeded,
  };

};
