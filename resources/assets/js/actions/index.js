import request from 'superagent';


export const ADD_CHANNEL = 'ADD_CHANNEL';

export const addChannel = (channel) => {
  return { type: ADD_CHANNEL, channel };
}


export const fetchChannel = (id) => {
  return (dispatch) => {

    return request('/channels/' + id)
      .then((result) => dispatch({ type: ADD_CHANNEL, channel: result.body }))
      .catch((err) => alert(err));

  }
};
