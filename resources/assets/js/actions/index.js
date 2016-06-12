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
      .then((result) => console.log(result))
      .catch((err) => alert(err));

  };
};
