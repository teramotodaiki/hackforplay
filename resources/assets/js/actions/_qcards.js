export const PUT_QCARD_LOCAL = 'PUT_QCARD_LOCAL';
export const PUT_QCARD_ORIGIN = 'PUT_QCARD_ORIGIN';
export const PUT_QCARD_BOTH = 'PUT_QCARD_BOTH';

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
