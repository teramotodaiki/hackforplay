import request from 'superagent';


export const ADD_CHANNEL = 'ADD_CHANNEL';

export const addChannel = (channel) => {
  return { type: ADD_CHANNEL, channel };
}


export const FETCH_CHANNEL = 'FETCH_CHANNEL';

export const fetchChannel = (id) => {
  return (dispatch) => {

    dispatch({ type: FETCH_CHANNEL });

    return request('/channels/' + id)
      .then((result) => dispatch({ type: FETCH_CHANNEL, channel: result.body }))
      .catch((err) => alert(err));

  }
};
