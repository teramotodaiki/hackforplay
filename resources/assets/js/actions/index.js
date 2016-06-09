import request from 'superagent';


export const ADD_CHANNEL = 'ADD_CHANNEL';

export const addChannel = (channel) => {
  return { type: ADD_CHANNEL, channel };
}


const fetchChannel = (id) => {
  return (dispatch) => {

    return request('/channels/' + id)
      .then((result) => dispatch({ type: ADD_CHANNEL, channel: result.body }))
      .catch((err) => alert(err));

  }
};

export const fetchChannelIfNeeded = (id) => {
  return (dispatch, getState) => {

    const channel = getState().channel.channels.find((item) => item.ID === +id);
    if (!channel) {
      dispatch(fetchChannel(id));
    }
  }
}
