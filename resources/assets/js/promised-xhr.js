/**
 * ES6 Promise XMLHttpRequest wrapper
 * https://github.com/frikille/promised-xhr
*/


// https://github.com/frikille/promised-xhr/blob/master/lib/xhr-object.js
var xhrObject = function () {
  if (window.XMLHttpRequest) return new XMLHttpRequest();
  try {
    return new ActiveXObject('msxml2.xmlhttp.6.0');
  } catch (e) {}

  try {
    return new ActiveXObject('msxml2.xmlhttp.3.0');
  } catch (e) {}
  try {
    return new ActiveXObject('msxml2.xmlhttp');
  } catch (e) {}
};


// https://github.com/frikille/promised-xhr/blob/master/index.js
var buildParamsAsQueryString = function (params) {
  var queryString = [];

  for (var p in params) {
    if (params.hasOwnProperty(p)) {
      queryString.push(p + '=' + params[p]);
    }
  }

  return queryString.length > 0 ? '?' + queryString.join('&') : '';
};

var parseHeaders = function (headerStrings) {
  var headers = {},
    match,
    regexp = /^([^:]+): (.*)/;

  for (var i = 0, len = headerStrings.length; i < len; i++) {
    match = headerStrings[i].match(regexp);
    if (match) {
      headers[match[1].toLowerCase()] = match[2];
    }
  }

  return headers;
};

var sendRequest = function (options) {

  var client = xhrObject();
  var url = options.url;

  if (options.method == 'GET') {
    url += buildParamsAsQueryString(options.data);
  }

  client.open(options.method || 'GET', url, true);

  if (options.credentials) {
    client.withCredentials = true;
  }

  if (options.headers) {
    for (var key in options.headers) {
      if (options.headers.hasOwnProperty(key)) {
        client.setRequestHeader(key, options.headers[key]);
      }
    }
  }

  if (options.fileUpload) {
    return new Promise(function (resolve, reject){
      client.onreadystatechange = function () {
        if (client.readyState !== 4) return;

        if (client.status < 400) {
          setResponseObject({}, resolve);
        } else {
          setResponseObject(new Error('The server encountered an error with a status code ' + client.status), reject);
        }

        function setResponseObject (response, callback) {
          response.status = client.status;
          response.headers = parseHeaders(client.getAllResponseHeaders().split('\n'));
          response.body = client.responseText;

          callback(response);
        }
      };

      if (options.onUploadProgress) {
        client.upload.onprogress = function(e) {
          var percentLoaded;
          if (e.lengthComputable) {
            percentLoaded = Math.round((e.loaded / e.total) * 100);
            return options.onUploadProgress(percentLoaded, percentLoaded === 100 ? 'Finalizing.' : 'Uploading.');
          }
        };
      }

      client.onerror = reject;

      client.send(options.file);
    });
  }

  return new Promise(function (resolve, reject){
    client.onreadystatechange = function () {
      if (client.readyState !== 4) return;

      if (client.status < 400) {
        setResponseObject({}, resolve);
      } else {
        setResponseObject(new Error('The server encountered an error with a status code ' + client.status), reject);
      }

      function setResponseObject (response, callback) {
        response.status = client.status;
        response.headers = parseHeaders(client.getAllResponseHeaders().split('\n'));
        response.body = client.responseText;

        callback(response);
      }
    };

    client.onerror = reject;

    if (options.method != 'GET') {
      client.setRequestHeader('Content-Type', 'application/json');
      client.send(JSON.stringify(options.data));
    } else {
      client.send();
    }
  });
};

var sendFormData = function (options) {
  var client = xhrObject();
  var url = options.url;

  client.open(options.method, url, true);

  if (options.credentials) {
    client.withCredentials = true;
  }

  if (options.headers) {
    for (var key in options.headers) {
      if (options.headers.hasOwnProperty(key)) {
        client.setRequestHeader(key, options.headers[key]);
      }
    }
  }

  return new Promise(function (resolve, reject) {
    client.onreadystatechange = function () {
      if (client.readyState !== 4) return;

      if (client.status < 400) {
        setResponseObject({}, resolve);
      } else {
        setResponseObject(new Error('The server encountered an error with a status code ' + client.status), reject);
      }

      function setResponseObject (response, callback) {
        response.status = client.status;
        response.headers = parseHeaders(client.getAllResponseHeaders().split('\n'));
        response.body = client.responseText;

        callback(response);
      }
    };

    client.onerror = reject;

    var formData;

    if (options.data) {
      formData = new FormData();

      for (var key in options.data) {
        if (options.data.hasOwnProperty(key)) {
          formData.append(key, options.data[key]);
        }
      }
    } else {
      formData = options.formData;
    }

    client.send(formData);

  });
};

var parseJson = function (response) {
  response.body = JSON.parse(response.body);
  return response;
};

var parseError = function (response) {
  if (response.body) {
    try {
      response = parseJson(response);
    } catch (e) {}
  }

  throw response;
};

module.exports = {
  base: '',
  get : function (url, options) {
    options = options || {};
    options.headers = options.headers || {};

    options.method = 'GET';

    if (typeof url === 'string') {
      options.url = this.base + url;
    }

    if (options.jsonContent !== false) {
      return sendRequest(options).then(parseJson, parseError);
    } else {
      return sendRequest(options);
    }
  },

  post : function (url, options) {
    options = options || {};
    options.headers = options.headers || {};

    if (typeof url === 'string') {
      options.url = this.base + url;
    }

    options.method = 'POST';

    if (options.jsonContent !== false && 'data' in options) {
      return sendRequest(options).then(parseJson, parseError);
    } else {
      return sendRequest(options);
    }
  },

  send : function (url, options) {
    options = options || {};
    options.headers = options.headers || {};

    if (typeof url === 'string') {
      options.url = this.base + url;
    }

    if (options.jsonContent !== false && 'data' in options) {
      return sendRequest(options).then(parseJson, parseError);
    } else {
      return sendRequest(options);
    }
  },

  sendFormData: function (url, options) {
    options = options || {};

    options.headers = options.headers || {};

    if (typeof url === 'string') {
      options.url = this.base + url;
    }

    options.method = options.method || 'POST';

    if (options.jsonContent !== false && 'data' in options) {
      return sendFormData(options).then(parseJson, parseError);
    } else {
      return sendFormData(options);
    }
  }
};
