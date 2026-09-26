QY.test('城市目录覆盖省会与热门城市', function () {
  var capitals = QY.CITIES.filter(function (city) { return city.type === 'capital'; });
  var tourist = QY.CITIES.filter(function (city) { return city.type === 'tourist'; });
  QY.assert.ok(capitals.length >= 31, '至少需要 31 个省级行政中心');
  QY.assert.ok(tourist.length >= 20, '至少需要 20 个热门旅游城市');
});

QY.test('北京到上海距离在合理区间', function () {
  var distance = QY.haversine(QY.getCity('北京'), QY.getCity('上海'));
  QY.assert.ok(distance > 1000 && distance < 1150, '距离应约为 1050 公里');
});

QY.test('路线键忽略日期但区分天数区间', function () {
  QY.assert.equal(QY.routeKey('武汉', '成都', 3), QY.routeKey('武汉', '成都', 3));
  QY.assert.ok(QY.routeKey('武汉', '成都', 3) !== QY.routeKey('武汉', '成都', 7), '不同天数区间应生成不同路线键');
});

QY.test('方案和收藏可写入本地状态', function () {
  QY.store.reset();
  QY.store.savePlan({ id: 'p1', title: '武汉到成都', routeId: 'r1' });
  QY.store.toggleFavorite('r1');
  QY.assert.equal(QY.store.read().savedPlans.length, 1);
  QY.assert.equal(QY.store.read().favorites.length, 1);
  QY.store.reset();
});