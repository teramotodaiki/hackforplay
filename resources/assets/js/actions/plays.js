import { createAction } from 'redux-actions';

import createREST from './restfulActions.js';
const REST = createREST('plays');

export const setPlay = createAction('SET_PLAY');
export const mergePlay = createAction('MERGE_PLAY');
export const deletePlay = createAction('DELETE_PLAY');

export const indexPlay = REST.index(setPlay);
export const showPlay = REST.show(setPlay);
export const updatePlay = REST.update(setPlay);
export const destroyPlay = REST.destroy(deletePlay);
