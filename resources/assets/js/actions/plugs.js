import { createAction } from 'redux-actions';

import createREST from './restfulActions.js';
const REST = createREST('plugs');

export const setPlug = createAction('SET_PLUG');
export const mergePlug = createAction('MERGE_PLUG');
export const deletePlug = createAction('DELETE_PLUG');

export const indexPlug = REST.index(setPlug);
export const showPlug = REST.show(setPlug);
export const updatePlug = REST.update(setPlug);
export const storePlug = REST.store(setPlug);
export const destroyPlug = REST.destroy(deletePlug);
