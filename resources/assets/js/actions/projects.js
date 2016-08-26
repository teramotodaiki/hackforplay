import request from './request';

import { createAction } from 'redux-actions';

import createREST from './restfulActions.js';
const REST = createREST('projects');

export const setProject = createAction('SET_PROJECT');
export const mergeProject = createAction('MERGE_PROJECT');
export const deleteProject = createAction('DELETE_PROJECT');

export const indexProject = REST.index(setProject);
export const showProject = REST.show(setProject);
export const updateProject = REST.update(setProject);
export const destroyProject = REST.destroy(deleteProject);

export const showProjectIfNeeded =
  REST.showIfNeeded(setProject, (state) => state.projects);
