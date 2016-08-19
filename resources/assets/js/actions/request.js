import request from 'superagent-use';
import superagentPromisePlugin from 'superagent-promise-plugin';

request.use(superagentPromisePlugin);
request.use((req) => {
  req.set('X-Requested-With', 'XMLHttpRequest');
  req.set('X-CSRF-TOKEN', getCsrfToken());
  req.set('Content-Type', 'application/json');
  return req;
});

request.put = (...args) => {
  // PUT method is NOT allowed in Microsoft Azure Web Apps, so use a fake method
  return request
    .post.apply(request, args)
    .send({ _method: 'PUT' });
};

var _csrfToken = null;
const getCsrfToken = () => {
  if (_csrfToken) return _csrfToken || '';
  const element = document.querySelector('meta[name="csrf-token"]');
  return _csrfToken = element && element.getAttribute('content');
};

export default request;
