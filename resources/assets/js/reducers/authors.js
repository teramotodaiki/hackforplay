/**
 *  authors
 *    | \
 *  {author}
 *      |
 *    plugs
 *      | \ ...
 *    {plug}
*/

import { ADD_AUTHOR, ADD_PLUG } from '../actions/';


export const authors = (state = {}, action) => {
  switch (action.type) {

    case ADD_AUTHOR:
      return assignRecursive(state, action.author, null);

    case ADD_PLUG:
      return assignRecursive(state, null, action.plug);

    default:
      return state;
  }
};

const assignRecursive = (state, author, plug) => {
  if (plug) {
    // 子を追加. 現時点のparent nodeがあれば引き継ぐ, なければ仮オブジェクトを作成する
    const _author = state[plug.author_id] || { id: plug.author_id };
    const _state = Object.assign({}, state, {
      [_author.id]: Object.assign({}, _author, {
        plugs: Object.assign({}, _author.plugs, {
          [plug.id]: plug,
        })
      })
    });
    return assignRecursive(_state, author, null);
  }

  if (author) {
    // 子を持つ親を追加. 古いnodeは抹消し、子nodeだけを引き継いだ新たなnodeを作成する.
    const plugs = 'plugs' in state[author.id] ? state[author.id].plugs : {};
    return Object.assign({}, state, {
      [author.id]: Object.assign({}, author, { plugs })
    });
  }

  return state;
};
