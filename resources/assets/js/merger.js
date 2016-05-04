// This is a mixin class provides some merge methods
const Merger = {
  // Merge styles, props, and others
  m() {
    return Object.assign.apply(null, Array.from(arguments));
  },
  // { btn: ['success', 'lg'] } convert to 'btn btn-sucess btn-lg'
  p() {
    return Array.from(arguments).map((item) => {
      // @scope: an each Object
      return Object.keys(item).map((key) => {
        // @scope: an each Keys
        const pre = ' ' + key + '-';
        const attr = item[key] instanceof Array ? pre + item[key].join(pre) : pre + item[key];
        return key + attr;
      }).join(' ');
    }).join(' ');
  }
};

export default Merger;
