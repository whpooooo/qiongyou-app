(function () {
  var root = window.QY = window.QY || {};

  root.routeInputFromHotRoute = function (route) {
    return {
      budget: route.budget,
      travellers: 2,
      companionType: 'friends',
      origin: route.origin,
      destination: route.destination,
      waypoints: route.waypoints.slice(),
      startDate: '2026-10-01',
      days: route.days,
      modes: route.modes.slice(),
      priority: 'balanced'
    };
  };

  function routeChain(route, arrow) {
    return [route.origin].concat(route.waypoints).concat(route.destination).join(arrow || ' → ');
  }

  root.renderHotRoutes = function () {
    var view = document.getElementById('view-home');
    if (!view) return;
    var section = document.createElement('section');
    section.id = 'hot-routes';
    section.className = 'content-section';
    section.innerHTML = '<div class="section-head"><div><p class="eyebrow">热门路线</p><h2>已经有人替你走通过</h2></div></div><div class="horizontal-list">' +
      root.HOT_ROUTES.map(function (route) {
        var favorited = root.store.read().favorites.indexOf(route.id) >= 0;
        return '<article class="hot-route-card"><div class="route-cover" style="background-image:linear-gradient(rgba(23,33,27,.28),rgba(23,33,27,.66)),url(' + root.imageForRoute(route) + ')"><span>' + root.escapeHtml(route.origin) + ' → ' + root.escapeHtml(route.destination) + '</span></div><h3>' + root.escapeHtml(route.title) + '</h3><p>' + root.escapeHtml(routeChain(route)) + '</p><div class="metric-row"><span>' + route.days + ' 天</span><span>¥' + Number(route.budget).toLocaleString('zh-CN') + '</span><span>' + route.modes.length + ' 种交通</span></div><div class="route-card-actions"><button type="button" class="text-button" data-favorite-route="' + route.id + '">' + (favorited ? '已收藏' : '收藏路线') + '</button><button type="button" class="secondary-button" data-route-id="' + route.id + '">查看途径点</button></div></article>';
      }).join('') + '</div>';
    view.appendChild(section);
    section.querySelectorAll('[data-favorite-route]').forEach(function (button) {
      button.addEventListener('click', function () {
        root.store.toggleFavorite(button.getAttribute('data-favorite-route'));
        root.renderHome();
        root.renderMyPage();
      });
    });
    section.querySelectorAll('[data-route-id]').forEach(function (button) {
      button.addEventListener('click', function () { root.renderRouteDetail(button.getAttribute('data-route-id')); });
    });
  };

  root.renderRouteDetail = function (routeId) {
    var route = root.getHotRoute(routeId);
    var view = document.getElementById('view-route');
    if (!route || !view) return;
    var points = [route.origin].concat(route.waypoints).concat(route.destination);
    var segments = [];
    for (var index = 0; index < points.length - 1; index += 1) {
      var options = route.modes.map(function (mode) { return root.estimateLeg(points[index], points[index + 1], mode, 2); });
      var cheapest = options.slice().sort(function (a, b) { return a.cost - b.cost; })[0];
      segments.push('<article class="route-segment"><div><strong>' + root.escapeHtml(points[index]) + ' → ' + root.escapeHtml(points[index + 1]) + '</strong><p>约 ' + cheapest.km + ' 公里，最低模拟费用 ¥' + cheapest.cost + '，约 ' + cheapest.hours + ' 小时</p></div><span>' + options.map(function (item) { return item.modeLabel + ' ¥' + item.cost; }).join(' · ') + '</span></article>');
    }
    view.innerHTML = [
      '<button type="button" class="text-button" data-back-home>返回首页</button>',
      '<section class="hero-card route-hero" style="background-image:linear-gradient(90deg,rgba(23,33,27,.92),rgba(23,33,27,.42)),url(' + root.imageForRoute(route) + ')"><p class="eyebrow">热门路线</p><h1>' + root.escapeHtml(route.title) + '</h1><p>' + root.escapeHtml(routeChain(route)) + '</p><div class="metric-row"><span>' + route.days + ' 天</span><span>建议预算 ¥' + Number(route.budget).toLocaleString('zh-CN') + '</span></div></section>',
      '<section class="panel"><h2>途径点行程线</h2><div class="route-timeline">' + segments.join('') + '</div><p class="data-source">以上均为模拟预估，接入实时数据前不会显示真实班次。</p><button type="button" class="primary-button" data-use-route>一键带入我的规划</button></section>'
    ].join('');
    view.querySelector('[data-back-home]').addEventListener('click', function () { root.navigate('home'); });
    view.querySelector('[data-use-route]').addEventListener('click', function () { root.prefillPlan(root.routeInputFromHotRoute(route)); });
    root.navigate('route');
  };
}());