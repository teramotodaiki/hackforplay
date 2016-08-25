import { createAction } from 'redux-actions';

import createREST from './restfulActions.js';
const REST = createREST('stages');

export const setStage = createAction('SET_STAGE');
export const mergeStage = createAction('MERGE_STAGE');
export const deleteStage = createAction('DELETE_STAGE');

export const indexStage = REST.index(setStage);
export const showStage = REST.show(setStage);
export const updateStage = REST.update(setStage);
export const destroyStage = REST.destroy(deleteStage);

export const showStageIfNeeded =
  REST.showIfNeeded(setStage, (state) => state.stages);
