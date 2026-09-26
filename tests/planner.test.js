QY.test('路线输入缺少必填项时返回明确错误', function () {
  var result = QY.validatePlanInput({});
  QY.assert.ok(result.errors.indexOf('请选择出发地') >= 0, '应提示出发地');
  QY.assert.ok(result.errors.indexOf('请选择目的地') >= 0, '应提示目的地');
  QY.assert.ok(result.errors.indexOf('请至少选择一种交通方式') >= 0, '应提示交通方式');
});

QY.test('途径点不超过三个且不能重复', function () {
  var result = QY.validatePlanInput({
    budget: 3000, travellers: 2, companionType: 'friends', origin: '武汉',
    destination: '成都', waypoints: ['重庆', '重庆', '西安', '兰州'],
    startDate: '2026-10-01', days: 7, modes: ['train']
  });
  QY.assert.ok(result.errors.indexOf('途径点最多 3 个') >= 0, '应限制三个途径点');
  QY.assert.ok(result.errors.indexOf('途径点不能重复') >= 0, '应阻止重复途径点');
});

QY.test('固定输入稳定生成三套有差异的方案', function () {
  var plans = QY.generatePlans({
    budget: 4000, travellers: 2, companionType: 'friends', origin: '武汉',
    destination: '成都', waypoints: ['重庆'], startDate: '2026-10-01', days: 7,
    modes: ['plane', 'train', 'coach', 'rental'], priority: 'balanced'
  });
  QY.assert.deepEqual(plans.map(function (plan) { return plan.label; }), ['极限省钱', '均衡推荐', '省时优先']);
  QY.assert.ok(plans[0].totalCost.normal <= plans[1].totalCost.normal, '省钱方案不应比均衡方案更贵');
  QY.assert.ok(plans[1].totalCost.normal <= plans[2].totalCost.normal, '均衡方案不应比省时方案更贵');
  QY.assert.deepEqual(plans[1].route, ['武汉', '重庆', '成都']);
  QY.assert.equal(plans[1].segments.length, 2);
  QY.assert.equal(plans[1].dataSource, '模拟预估');
});
QY.test('超出预算时预算结余显示负数', function () {
  var plans = QY.generatePlans({
    budget: 1000, travellers: 2, companionType: 'friends', origin: '武汉',
    destination: '成都', waypoints: ['重庆'], startDate: '2026-10-01', days: 7,
    modes: ['plane', 'train', 'coach', 'rental'], priority: 'balanced'
  });
  QY.assert.ok(plans[0].totalCost.normal > 1000, '测试条件应确实超预算');
  QY.assert.ok(plans[0].budgetBalance < 0, '超预算时应显示负结余');
});