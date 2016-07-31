// iframe ロード
function loadStage(code) {
  var game = document.getElementById('item-embed-iframe');

  var loading = (function () {
    var deferred = new $.Deferred();
    game.onload = deferred.resolve.bind(deferred);
    game.onerror = deferred.reject.bind(deferred);
    game.src = "/embed?type=code";
    return deferred;
  })();

  var fetching = getStage(getParam('id'));

  return $.when(loading, fetching)
  .done(function (loaded, fetched) {
    var stage = fetched instanceof Array ? fetched[0] : fetched;
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
