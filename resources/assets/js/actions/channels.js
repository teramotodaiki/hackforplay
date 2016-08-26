import equal from 'deep-equal';
import request from './request';
import superagent from 'superagent';

import { createAction } from 'redux-actions';

import createREST from './restfulActions.js';
const REST = createREST('channels');

export const setChannel = createAction('SET_CHANNEL');
export const mergeChannel = createAction('MERGE_CHANNEL');
export const deleteChannel = createAction('DELETE_CHANNEL');

export const indexChannel = REST.index(setChannel);
export const showChannel = REST.show(setChannel);
export const updateChannel = REST.update(setChannel);
export const storeChannel = REST.store(setChannel);
export const destroyChannel = REST.destroy(deleteChannel);


export const showChannelIfNeeded =
  REST.showIfNeeded(setChannel, (state) => state.channels);


export const fetchChannel = (id, query = {}) => {
  return (dispatch) => {

    return request
      .get('/channels/' + id)
      .query(query)
      .then((result) => {
        dispatch({ type: ADD_CHANNEL, channel: result.body });
        if (query.chats) {
          result.body.chats
            .forEach((chat) => dispatch({ type: ADD_CHAT, chat }));
        }
        return result;
      })
      .catch((err) => alert(err));

  }
};


export const postChannel = (channel) => {
  return (dispatch) => {

    return request
      .post('/channels')
      .accept('json')
      .send(channel)
      .then((result) => {
        dispatch({ type: ADD_CHANNEL, channel: result.body });
        return result;
      });

  };
};

export const postBell = (team, channel) => {
  return (dispatch) => {

    return request
      .post(`/teams/${team}/bells`)
      .send({ channel })
      .then((result) => result)
      .catch((err) => alert(arr));

  };
};

export const createBell = ({ team, channel, qcard }) => {
  return (dispatch) => {

    return request
      .post(`/teams/${team}/bells`)
      .send({ channel, qcard })
      .then((result) => result)
      .catch((err) => alert(err.message));

  };
};


const GITHUB_API = 'https://api.github.com';

export const createGist = (channel) =>
  (dispatch) =>
    superagent
      .post(GITHUB_API + '/gists')
      .set('Accept', 'application/vnd.github.v3+json')
      .send({ public: true, files: {
        [`channel-${channel.id}.js`]:
          {'content': channel.head.raw_code} }
      });
