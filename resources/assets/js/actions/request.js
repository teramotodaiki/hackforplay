import request from 'superagent-use';
import superagentPromisePlugin from 'superagent-promise-plugin';

request.use(superagentPromisePlugin);
request.use((req) => {
  req.set('X-Requested-With', 'XMLHttpRequest');
  req.set('X-CSRF-TOKEN', getCsrfToken());
  req.set('Content-Type', 'application/json');
  return req;
});

const fakes = {
  put: 'PUT',
  del: 'DELETE',
};

Object.keys(fakes)
.forEach((method) => {
  request[method] = (...args) => {
    return request
      .post.apply(request, args)
      .send({ _method: fakes[method] });
  };
});


var _csrfToken = null;
const getCsrfToken = () => {
  if (_csrfToken) return _csrfToken || '';
  const element = document.querySelector('meta[name="csrf-token"]');
  return _csrfToken = element && element.getAttribute('content');
};

export default request;
