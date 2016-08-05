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

const makeAssignRecursive = (parentName, childName) => {
  return (state, parent, child) => {
    if (child) {
      // 子を追加. 現時点のparent nodeがあれば引き継ぐ, なければ仮オブジェクトを作成する
      const _parent = state[child[`${parentName}_id`]] || { id: child[`${parentName}_id`] };
      const _state = Object.assign({}, state, {
        [_parent.id]: Object.assign({}, _parent, {
          [`${childName}s`]: Object.assign({}, _parent[`${childName}s`], {
            [child.id]: child,
          })
        })
      });
      return assignRecursive(_state, parent, null);
    }

    if (parent) {
      // 子を持つ親を追加. 古いnodeは抹消し、子nodeだけを引き継いだ新たなnodeを作成する.
      const _children = `${childName}s` in state[parent.id] ? state[parent.id][`${childName}s`] : {};
      return Object.assign({}, state, {
        [parent.id]: Object.assign({}, parent, { [`${childName}s`]: _children })
      });
    }

    return state;
  };
};

const assignRecursive = makeAssignRecursive('author', 'plug');
