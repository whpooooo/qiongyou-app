QY.test('下一站页面包含四个排序按钮和筛选表单', function () {
  document.body.innerHTML = '<section id="view-home"></section><section id="view-next"></section>';
  QY.renderNextPage();
  QY.assert.ok(document.body.textContent.indexOf('下一站，未知') >= 0, '应显示模块标题');
  QY.assert.equal(document.querySelectorAll('[data-sort]').length, 4, '应有四个排序按钮');
  QY.assert.ok(document.querySelector('#surprise-form'), '应显示惊喜筛选表单');
});

QY.test('揭晓界面包含主推荐和两个备选', function () {
  document.body.innerHTML = '<div id="surprise-result" data-excluded=""></div>';
  var input = { origin:'武汉', days:5, budget:3000, month:'10', companionType:'friends', interests:['古城'], startDate:'2026-10-01' };
  var results = QY.recommendDestinations(input, 'balanced');
  QY.renderSurprise({ main:results[0], alternatives:results.slice(1,3) });
  QY.assert.ok(document.querySelector('.surprise-main'), '应渲染主推荐');
  QY.assert.equal(document.querySelectorAll('.surprise-alt').length, 2, '应渲染两个备选');
});

QY.test('就它了可以把推荐目的地带回首页表单', function () {
  document.body.innerHTML = '<section id="view-home"></section><section id="view-next"></section>';
  QY.renderHome();
  QY.prefillPlan({ origin:'武汉', destination:'丽江', days:5, budget:2600 });
  QY.assert.equal(document.querySelector('[name="destination"]').value, '丽江');
  QY.assert.equal(document.querySelector('[name="days"]').value, '5');
});
QY.test('推荐揭晓卡包含目的地图片', function () {
  document.body.innerHTML = '<div id="surprise-result" data-excluded=""></div>';
  var input = { origin:'武汉', days:5, budget:3000, month:'10', companionType:'friends', interests:['古城'], startDate:'2026-10-01' };
  var results = QY.recommendDestinations(input, 'balanced');
  QY.renderSurprise({ main:results[0], alternatives:results.slice(1,3) });
  QY.assert.equal(document.querySelectorAll('.destination-image').length, 3, '主推荐和备选都应有图片');
});