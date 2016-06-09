import request from 'superagent';


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
