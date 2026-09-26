QY.test('旅人现场按路线显示聚合主题和发布表单', function () {
  QY.store.reset();
  document.body.innerHTML = '<section id="view-community"></section>';
  QY.renderCommunityPage();
  QY.assert.ok(document.body.textContent.indexOf('旅人现场') >= 0, '应显示社区标题');
  QY.assert.ok(document.body.textContent.indexOf('只看真去过的人怎么说') >= 0, '应显示副标题');
  QY.assert.ok(document.querySelector('#community-post-form'), '应显示发布表单');
  QY.assert.ok(document.querySelectorAll('.route-topic').length >= 2, '应显示路线主题');
  QY.assert.ok(document.querySelector('.post-cover'), '社区内容应包含路线图片');
  QY.store.reset();
});

QY.test('我的页面展示已保存方案和收藏路线', function () {
  QY.store.reset();
  QY.store.savePlan({ id:'saved-1', title:'武汉到成都', plan:{ label:'均衡推荐', totalCost:{ normal:1800 } } });
  QY.store.toggleFavorite('wuhan-chengdu');
  document.body.innerHTML = '<section id="view-my"></section>';
  QY.renderMyPage();
  QY.assert.ok(document.body.textContent.indexOf('武汉到成都') >= 0, '应展示保存方案');
  QY.assert.ok(document.body.textContent.indexOf('从江城吃到天府') >= 0, '应展示收藏路线');
  QY.store.reset();
});

QY.test('应用启动渲染全部主要页面', function () {
  document.body.innerHTML = '<section id="view-home"></section><section id="view-next"></section><section id="view-community"></section><section id="view-my"></section>';
  QY.renderAllPages();
  QY.assert.ok(document.querySelector('#plan-form'), '首页应渲染');
  QY.assert.ok(document.querySelector('#surprise-form'), '下一站应渲染');
  QY.assert.ok(document.querySelector('#community-post-form'), '社区应渲染');
  QY.assert.ok(document.querySelector('#view-my .my-hero'), '我的页面应渲染');
});