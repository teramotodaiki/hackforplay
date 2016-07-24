import { combineReducers } from 'redux';
import { ADD_CHANNEL, ADD_CHAT, PUT_QCARD_LOCAL, PUT_QCARD_ORIGIN, PUT_QCARD_BOTH, ADD_PROJECT, ADD_STAGE } from '../actions/';

/**
 * projects
 * |  \ ...
 * {project}
 *  |
 * stages
 *    | \ ...
 *  {stage}
*/
// NOTE: DON'T access [stage.project], because it will not update
export const projects = (state = {}, action) => {
  switch (action.type) {

    case ADD_PROJECT:

      return Object.assign({}, state, {
        [project.id]: Object.assign({}, action.project, {
          stages: composedStages({
            project: state[action.project.id],
            array: action.project.stages
          })
        })
      });

    case ADD_STAGE:

      const projectId = action.stage.project.id;
      const project = state[projectId] || { id: projectId };

      return Object.assign({}, state, {
        [project.id]: Object.assign({}, project, {
          stages: composedStages({
            project: project,
            stage: action.stage
          })
        })
      });

    default:
      return state;
  }

  const composedStages = ({ project = {}, array = [], stage = {} }) => {
    return Object.assign({},
     'stages' in project ? project.stages : {},
     getKeyValueObject.apply(null, array),
     'id' in stage ? { [stage.id]: stage } : {}
    );
  }
};

/**
 * Input:
 *  [{ id: 1, name: 'one' }, { id: 2, name: 'two' }]
 * Output:
 *  { '1': { id: 1, name: 'one' }, '2': { id: 2, name: 'two' } }
*/
const getKeyValueObject = (...args) => {
  const key = 'id';
  return Object.assign.apply(null, args.filter((item) => {
    return typeof item === 'object' && key in item;
  }).map((item) => {
    return { [item[key]]: item };
  }));
};

// state { [id]: { channel object has id }, ... }
export const channels = (state = {}, action) => {
  switch (action.type) {

    case ADD_CHANNEL:

      return Object.assign({}, state, {
        [action.channel.ID]: action.channel
      });

    case ADD_CHAT:

      const channel = state[action.channelId];
      if (!channel) return state;
      const merged = Object.assign({}, channel, {
        chats: (channel.chats || []).concat(action.chat)
      });
      return Object.assign({}, state, {
        [action.channelId]: merged
      });

    default:
      return state;
  }
};

// state { local: { [id]: { q card object has id }, ... }, origin: { same as local } }
export const qcards = ({ local, origin } = {
  local: {},
  origin: {},
}, { type, qcard }) => {
  const node = qcard ? { [qcard.id]: qcard } : null;
  switch (type) {
    case PUT_QCARD_LOCAL:

      local = Object.assign({}, local, node);
      return { local, origin };

    case PUT_QCARD_ORIGIN:

      origin = Object.assign({}, origin, node);
      return { local, origin };

    case PUT_QCARD_BOTH:

      local = Object.assign({}, local, node);
      origin = Object.assign({}, origin, node);
      return { local, origin };

    default:
      return { local, origin };
  }
};
