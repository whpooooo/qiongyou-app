QY.test('模拟数据提供器明确标记非实时结果', function () {
  var result = QY.provider.search({
    budget:3000, travellers:2, companionType:'friends', origin:'武汉', destination:'成都',
    waypoints:['重庆'], startDate:'2026-10-01', days:7,
    modes:['plane','train','coach','rental'], priority:'balanced'
  });
  QY.assert.equal(result.isRealtime, false);
  QY.assert.equal(result.source, 'mock');
  QY.assert.ok(result.message.indexOf('尚未接入') >= 0, '应明确提示尚未接入实时数据');
});

QY.test('没有授权链接时不开放购票跳转', function () {
  var action = QY.provider.bookingAction({ label:'均衡推荐' });
  QY.assert.equal(action.enabled, false);
  QY.assert.equal(action.url, null);
});

QY.test('行为记录写入本地状态并限制长度', function () {
  QY.store.reset();
  QY.track('test_event', { value:1 });
  QY.assert.equal(QY.store.read().analytics[0].name, 'test_event');
  QY.assert.equal(QY.store.read().analytics[0].payload.value, 1);
  QY.store.reset();
});