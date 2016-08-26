import { createAction } from 'redux-actions';

import request from './request';
import createREST from './restfulActions.js';
const REST = createREST('chats');

export const setChat = createAction('SET_CHAT');
export const mergeChat = createAction('MERGE_CHAT');
export const deleteChat = createAction('DELETE_CHAT');

export const indexChat =
  (channel_id, query = {}) =>
    (dispatch) =>
      request
        .get(`/api/channels/${channel_id}/chats`)
        .query(query)
        .then((result) => {
          result.body.data.forEach((payload) => dispatch(setChat(payload)));
          return result;
        });

export const storeChat =
  (payload) =>
    (dispatch) =>
      request
        .post(`/api/channels/${payload.channel_id}/chats`)
        .send(payload)
        .then((result) => {
          dispatch(setChat(result.body));
          return result;
        });
