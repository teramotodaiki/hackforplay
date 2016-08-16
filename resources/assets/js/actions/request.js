import request from 'superagent-use';
import superagentPromisePlugin from 'superagent-promise-plugin';

request.use(superagentPromisePlugin);
request.use((req) => {
  req.set('X-Requested-With', 'XMLHttpRequest');
  req.set('X-CSRF-TOKEN', getCsrfToken());
  return req;
})

var _csrfToken = null;
const getCsrfToken = () => {
  if (_csrfToken) return _csrfToken || '';
  const element = document.querySelector('meta[name="csrf-token"]');
  return _csrfToken = element && element.getAttribute('content');
};

export default request;
