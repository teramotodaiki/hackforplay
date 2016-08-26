import request from './request';
import { createAction } from 'redux-actions';

import createREST from './restfulActions.js';
const REST = createREST('authors');

export const setAuthor = createAction('SET_AUTHOR');
export const mergeAuthor = createAction('MERGE_AUTHOR');
export const deleteAuthor = createAction('DELETE_AUTHOR');

export const indexAuthor = REST.index(setAuthor);
export const showAuthor = REST.show(setAuthor);
export const updateAuthor = REST.update(setAuthor);
export const storeAuthor = REST.store(setAuthor);
export const destroyAuthor = REST.destroy(deleteAuthor);
