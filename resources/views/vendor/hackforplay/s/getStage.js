(function () {

  // on memory
  var state = new State();

  // Global interface of state
  window.getStage = function (id) {

    return state.get(id) ?
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

  // Cache
  window.setStage = function (stage) {
    state.set(stage);
  };

  function State () {
    var key = 'cached-stages';
    var prefix = 'id_';
    var state = $.parseJSON(localStorage.getItem(key) || '{}');

    this.get = function (id) {
      return state[prefix + id];
    }
    this.set = function (stage) {
      state[prefix + stage.id] = stage;
      var json = JSON.stringify(state);
      localStorage.setItem(key, json);
    }
  };
})();
