// iframe ロード
(function () {
  var elementId = 'item-embed-iframe';
  var policty = '/';

  window.loadStage = function (code) {
    var game = document.getElementById(elementId);
    if (game) {
      sessionStorage.removeItem('stage_param_smart_asset'); // 互換性維持
      return code ? loadByCode(game, code) : loadByStage(game);
    } else {
      // windowがloadされたあとに処理
      var deferred = new $.Deferred();
      window.addEventListener('load', deferred.resolve.bind(deferred));
      deferred.then(function () {
        return loadStage(code);
      });
      return deferred;
    }
  };

  function loadByStage(game) {
    var deferred = new $.Deferred();
    game.onload = deferred.resolve.bind(deferred);
    game.onerror = deferred.reject.bind(deferred);
    game.src = '/embed?type=stage&report=true&id=' + getParam('id');
    return deferred;
  }

  function loadByCode(game, code) {
    var loading = (function () {
      var deferred = new $.Deferred();
      game.onload = deferred.resolve.bind(deferred);
      game.onerror = deferred.reject.bind(deferred);
      game.src = "/embed?type=code&id=" + getParam('id');
      return deferred;
    })();

    var fetching = getStage(getParam('id'));

    return $.when(loading, fetching)
    .done(function (loaded, fetched) {
      var stage = fetched[0];
      game.contentWindow.postMessage({
        query: 'require',
        dependencies: [stage.implicit_mod],
        code: code,
      }, policty);
      return loaded;
    });
  }

})();
