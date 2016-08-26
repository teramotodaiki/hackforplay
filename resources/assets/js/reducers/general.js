
export const setReducer =
  (state, {payload}) => state.set(payload.id, payload);

export const mergeReducer =
  (state, {payload}) => state.set(payload.id, state.get(payload.id).merge(payload));

export const deleteReducer =
  (state, {payload}) => state.delete(payload.id);
