(function () {
  var root = window.QY = window.QY || {};
  var EMPTY = { savedPlans: [], favorites: [], posts: [], interactions: {}, analytics: [] };

  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  var memory = clone(EMPTY);

  function normalize(value) {
    return Object.assign(clone(EMPTY), value || {});
  }

  root.store = {
    read: function () {
      try {
        var saved = localStorage.getItem(root.CONST.STORAGE_KEY);
        return normalize(saved ? JSON.parse(saved) : memory);
      } catch (error) {
        return normalize(memory);
      }
    },
    write: function (state) {
      var next = normalize(state);
      memory = clone(next);
      try { localStorage.setItem(root.CONST.STORAGE_KEY, JSON.stringify(next)); } catch (error) { void error; }
      return next;
    },
    savePlan: function (plan) {
      var state = root.store.read();
      state.savedPlans = state.savedPlans.filter(function (item) { return item.id !== plan.id; });
      state.savedPlans.unshift(clone(plan));
      return root.store.write(state);
    },
    toggleFavorite: function (routeId) {
      var state = root.store.read();
      var index = state.favorites.indexOf(routeId);
      if (index === -1) state.favorites.push(routeId);
      else state.favorites.splice(index, 1);
      return root.store.write(state);
    },
    reset: function () {
      memory = clone(EMPTY);
      try { localStorage.removeItem(root.CONST.STORAGE_KEY); } catch (error) { void error; }
      return clone(EMPTY);
    }
  };
}());