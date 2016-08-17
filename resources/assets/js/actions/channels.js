import equal from 'deep-equal';
import request from './request';


export const ADD_CHANNEL = 'ADD_CHANNEL';

export const ADD_CHAT = 'ADD_CHAT';

export const PUT_QCARD_LOCAL = 'PUT_QCARD_LOCAL';
export const PUT_QCARD_ORIGIN = 'PUT_QCARD_ORIGIN';
export const PUT_QCARD_BOTH = 'PUT_QCARD_BOTH';



export const addChannel = (channel) => {
  return { type: ADD_CHANNEL, channel };
}

export const fetchChannel = ({ id, chats }) => {
  return (dispatch) => {

    return request
      .get('/channels/' + id)
      .query({ chats: chats })
      .then((result) => {
        dispatch({ type: ADD_CHANNEL, channel: result.body });
        return result;
      })
      .catch((err) => alert(err));

  }
};

export const fetchChannels = (query) => {
  return (dispatch) => {

    return request
      .get('/channels')
      .query(query)
      .then((result) => {
        result.body.data.forEach((channel) => {
          dispatch({ type: ADD_CHANNEL, channel });
        });
        return result;
      })
      .catch((err) => alert(err.message));

  };
};

export const updateChannel = (channel) => {
  return (dispatch) => {

    return request
      .put(`/channels/${channel.ID}`)
      .send(channel)
      .then((result) => {
        dispatch({ type: ADD_CHANNEL, channel: result.body });
        return result;
      });

  };
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


export const updateQcard = (qcard) => {
  return (dispatch, getState) => {

    const { qcards: { local } } = getState();
    qcard = Object.assign({}, local[qcard.id], qcard);
    return dispatch({ type: PUT_QCARD_LOCAL, qcard });

  }
};

export const pushQcard = (id) => {
  return (dispatch, getState) => {


    const { qcards: { local, origin } } = getState();

    // Expect timestamp
    const localNode = Object.assign({}, local[id], { updated_at: undefined });
    const originNode = Object.assign({}, origin[id], { updated_at: undefined });

    return equal(localNode, originNode) ? Promise.resolve() :
      request.put(`/qcards/${id}`)
      .send(localNode)
      .then((result) => {
        dispatch({ type: PUT_QCARD_ORIGIN, qcard: result.body });
        return result.body;
      })
      .catch((err) => alert(err.message));

  };
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

export const fetchQcard = (filter) => {
  return (dispatch) => {

    return request
      .get(`/qcards`)
      .query(filter)
      .then((result) => result)
      .catch((err) => alert(err.message));

  };
};