QY.test('热门路线模块展示完整路线和途径点', function () {
  document.body.innerHTML = '<section id="view-home"></section><section id="view-route"></section>';
  QY.renderHotRoutes();
  QY.assert.ok(document.querySelectorAll('.hot-route-card').length >= 8, '应展示热门路线卡片');
  QY.assert.ok(document.body.textContent.indexOf('武汉 → 重庆 → 成都') >= 0, '应展示途径点路线链');
});

QY.test('热门路线详情按分段显示交通', function () {
  document.body.innerHTML = '<section id="view-home"></section><section id="view-route"></section>';
  QY.renderRouteDetail('wuhan-chengdu');
  QY.assert.equal(document.querySelectorAll('.route-segment').length, 2, '武汉到成都加一个途径点应有两段');
  QY.assert.ok(document.body.textContent.indexOf('武汉 → 重庆') >= 0, '应显示第一段');
  QY.assert.ok(document.body.textContent.indexOf('重庆 → 成都') >= 0, '应显示第二段');
});

QY.test('热门路线可转换为规划输入', function () {
  var input = QY.routeInputFromHotRoute(QY.getHotRoute('beijing-xian'));
  QY.assert.deepEqual(input.waypoints, ['大同', '平遥']);
  QY.assert.equal(input.destination, '西安');
  QY.assert.equal(input.days, 9);
});
QY.test('热门路线卡使用本地风景图', function () {
  document.body.innerHTML = '<section id="view-home"></section><section id="view-route"></section>';
  QY.renderHotRoutes();
  var first = document.querySelector('.route-cover');
  QY.assert.ok(first.getAttribute('style').indexOf('assets/images/') >= 0, '路线卡应使用本地图片');
});