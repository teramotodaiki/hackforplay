// iframe ロード
function loadStage(code) {
  sessionStorage.removeItem('stage_param_smart_asset');

  var game = document.getElementById('item-embed-iframe');
  var reportParam = '&report=true&id=' + getParam('id');

  var loading = (function () {
    var deferred = new $.Deferred();
    game.onload = deferred.resolve.bind(deferred);
    game.onerror = deferred.reject.bind(deferred);
    game.src = "/embed?type=code" + (getParam('mode') === 'replay' ? reportParam : '');
    return deferred;
  })();

  var fetching = getStage(getParam('id'));

  return $.when(loading, fetching)
  .done(function (loaded, fetched) {
    var stage = fetched[0];
    game.contentWindow.postMessage({
      query: 'require',
      dependencies: [stage.implicit_mod],
      code: code || stage.script.raw_code,
    }, '/');
    return loaded;
  })
  .fail(function () {
    alert('Error! look at your console.');
    console.error(arguments);
  });
}
