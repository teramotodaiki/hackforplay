import request from './request';

export const fetchMyTeams = () => {
  return (dispatch) => {

    return request
      .get('/users/auth/teams')
      .then((result) => result)
      .catch((err) => alert(err.message));

  };
};

export const fetchTeam = (id) => {
  return (dispatch) => {

    return request
      .get(`/teams/${id}`)
      .then((result) => result);

  };
};
