(function () {
  var root = window.QY = window.QY || {};

  root.track = function (eventName, payload) {
    var state = root.store.read();
    state.analytics.unshift({ name:String(eventName), payload:payload || {}, at:new Date().toISOString() });
    state.analytics = state.analytics.slice(0, 200);
    root.store.write(state);
    return state.analytics[0];
  };
}());