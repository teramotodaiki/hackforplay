import request from 'superagent';

const API = {
  github: 'https://api.github.com'
};


export const ADD_CHANNEL = 'ADD_CHANNEL';

export const addChannel = (channel) => {
  return { type: ADD_CHANNEL, channel };
}


export const fetchChannel = ({ id, chats }) => {
  return (dispatch) => {

    return request
      .get('/channels/' + id)
      .query({ chats: chats })
      .then((result) => dispatch({ type: ADD_CHANNEL, channel: result.body }))
      .catch((err) => alert(err));

  }
};

export const ADD_CHAT = 'ADD_CHAT';

export const addChat = (channelId, chat) => {
  return { type: ADD_CHAT, channelId, chat };
};

export const postChat = (channelId, chat) => {
  return (dispatch) => {

    return request
      .post('/channels/' + channelId + '/chats')
      .query(chat)
      .then((result) => {})
      .catch((err) => alert(err));

  };
};

// export const CREATE_GIST = 'CREATE_GIST';

export const createGist = (files) => {
  return (dispatch) => {

    return request
      .post(API.github + '/gists')
      .set('Accept', 'application/vnd.github.v3+json')
      .send({ public: true, files })
      .then((result) => result)
      .catch((err) => alert(err));

  };
};

export const postBell = (teamId, channelId) => {
  return (dispatch) => {

    return request
      .post(`/teams/${teamId}/bells`)
      .send({ channelId: channelId })
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

export const PUT_QCARD_LOCAL = 'PUT_QCARD_LOCAL';
export const PUT_QCARD_ORIGIN = 'PUT_QCARD_ORIGIN';
export const PUT_QCARD_BOTH = 'PUT_QCARD_BOTH';

export const updateQcard = (qcard) => {
  return { type: PUT_QCARD_LOCAL, qcard };
};

export const pullQcard = (id) => {
  return (dispatch) => {

    return request
      .get(`/qcards/${id}`)
      .then((result) => {
        dispatch({ type: PUT_QCARD_BOTH, qcard: result.body });
        return result.body;
      })
      .catch((err) => alert(err.message));

  };
};
