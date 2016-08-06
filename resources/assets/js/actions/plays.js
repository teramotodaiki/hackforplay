import request from './request';

export const ADD_PLAY = 'ADD_PLAY';

export const addPlay = (play) => {
  return { type: ADD_PLAY, play };
};

export const fetchPlays = ({ page = 1 } = {}) => {
  return (dispatch) => {

    return request
      .get('/api/plays')
      .query({ page })
      .then((result) => {
        result.body.data.forEach((play) => dispatch(addPlay(play)));
        return result;
      });

  };
};
