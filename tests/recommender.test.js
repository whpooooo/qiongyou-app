function recommendationInput() {
  return {
    origin: '武汉', days: 5, budget: 3000, month: '10',
    companionType: 'friends', interests: ['古城', '人文'],
    startDate: '2026-10-01'
  };
}

QY.test('推荐结果包含费用、时间与可读理由', function () {
  var results = QY.recommendDestinations(recommendationInput(), 'balanced');
  QY.assert.ok(results.length >= 3, '应返回至少三个候选目的地');
  QY.assert.ok(results[0].totalCost > 0, '应包含预计费用');
  QY.assert.ok(results[0].hours > 0, '应包含预计耗时');
  QY.assert.ok(results[0].reason.indexOf('人均约') >= 0, '理由应包含预计人均费用');
});

QY.test('花费最低排序按费用升序', function () {
  var results = QY.recommendDestinations(recommendationInput(), 'lowestCost');
  QY.assert.ok(results[0].totalCost <= results[1].totalCost, '第一条应不贵于第二条');
  QY.assert.ok(results[1].totalCost <= results[2].totalCost, '第二条应不贵于第三条');
});

QY.test('季节最合适排序优先当季城市', function () {
  var results = QY.recommendDestinations(recommendationInput(), 'bestSeason');
  QY.assert.equal(results[0].seasonal, 1);
});

QY.test('惊喜推荐排除刚刚看过的目的地', function () {
  var first = QY.surpriseDestinations(recommendationInput(), null);
  var next = QY.surpriseDestinations(recommendationInput(), first.main.city.name);
  QY.assert.ok(next.main.city.name !== first.main.city.name, '换一个后不应重复主推荐');
  QY.assert.equal(next.alternatives.length, 2);
});