(function () {
  var root = window.QY = window.QY || {};

  root.renderMyPage = function () {
    var view = document.getElementById('view-my');
    if (!view) return;
    var state = root.store.read();
    var plans = state.savedPlans.map(function (item) {
      var plan = item.plan || {};
      return '<article class="saved-plan"><div><strong>' + root.escapeHtml(item.title) + '</strong><p>' + root.escapeHtml(plan.label || '已保存方案') + '</p></div><span>' + (plan.totalCost ? '¥' + Number(plan.totalCost.normal).toLocaleString('zh-CN') : '') + '</span></article>';
    }).join('');
    var favorites = state.favorites.map(function (id) {
      var route = root.getHotRoute(id);
      return route ? '<article class="saved-plan"><div><strong>' + root.escapeHtml(route.title) + '</strong><p>' + root.escapeHtml([route.origin].concat(route.waypoints).concat(route.destination).join(' → ')) + '</p></div><span>已收藏</span></article>' : '';
    }).join('');
    view.innerHTML = '<section class="hero-card my-hero"><p class="eyebrow">我的</p><h1>你的路线和收藏</h1><p>所有内容暂存在当前浏览器。</p></section><section class="panel"><h2>已保存方案</h2>' + (plans || '<p class="empty-state">还没有保存方案，先去首页生成三套方案吧。</p>') + '</section><section class="panel"><h2>收藏路线</h2>' + (favorites || '<p class="empty-state">还没有收藏路线。</p>') + '</section>';
  };
}());