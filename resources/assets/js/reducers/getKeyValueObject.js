/**
 * Input:
 *  [{ id: 1, name: 'one' }, { id: 2, name: 'two' }]
 * Output:
 *  { '1': { id: 1, name: 'one' }, '2': { id: 2, name: 'two' } }
*/

export default (...args) => {
  const key = 'id';

  const keyValues = args.filter((item) => {
    return typeof item === 'object' && key in item;
  }).map((item) => {
    return { [item[key]]: item };
  });

  return Object.assign.apply(null, [{}].concat(keyValues));
};
