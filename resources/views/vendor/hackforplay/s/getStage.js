(function () {

  // on memory
  var state = new State();

  // Global interface of state
  window.getStage = function (id) {

    return state.get(id) && state.get(id).script ?
    // hit
    (new $.Deferred).resolve([state.get(id)]) :
    // miss
    $.ajax({
      type: 'GET',
      url: `/api/stages/${id}`,
    })
    .done(function (result) {
      state.set(result);
      return result;
    });

  };

  window.getStageAll = function () {
    var cache = state.getInstance();
    return Object.keys(cache).map(function (key) { return cache[key]; });
  };

  // Cache
  window.setStage = function (stage) {
    state.set(stage);
    if (window.render) render();
  };

  function State () {
    var key = 'cached-stages';
    var prefix = 'id_';
    var state = $.parseJSON(sessionStorage.getItem(key) || '{}');

    this.get = function (id) {
      return state[prefix + id];
    }
    this.set = function (stage) {
      state[prefix + stage.id] = stage;
      var json = JSON.stringify(state);
      sessionStorage.setItem(key, json);
    }
    this.getInstance = function () {
      return state;
    };
  };
})();
