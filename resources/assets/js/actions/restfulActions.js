import { createAction } from 'redux-actions';
import request from './request';

export default (name) => {

  const prefix = `/api/${name}`;

  return {
    index: (action) =>
    ({ page = 1 } = {}) =>
      (dispatch) =>
        request
          .get(prefix)
          .query({ page })
          .then((result) => {
            result.body.data.forEach((payload) => dispatch(action(payload)));
            return result;
          }),

    show: (action) =>
    ({ id }) =>
      (dispatch) => {
        dispatch(action({ id, isLoading: true }));
        return request
          .get(prefix + '/' + id)
          .then((result) => {
            dispatch(action(result.body));
            return result;
          })
      },

    update: (action) =>
    (id, change) =>
      (dispatch) =>
        request
          .put(prefix + '/' + id)
          .send(change)
          .then((result) => {
            dispatch(action(result.body));
            return result;
          }),

    destroy: (action) =>
    ({ id }) =>
      (dispatch) =>
        request
          .del(prefix + '/' + id)
          .then((result) => {
            dispatch(action({ id }));
            return result;
          }),

  };

};
