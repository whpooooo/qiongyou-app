QY.test('第一版完整主流程可运行', function () {
  QY.store.reset();
  document.body.innerHTML = [
    '<header class="topbar"><strong>下一站，未知</strong></header>',
    '<main>',
    '<section id="view-home" class="view is-active"></section>',
    '<section id="view-next" class="view"></section>',
    '<section id="view-plans" class="view"></section>',
    '<section id="view-route" class="view"></section>',
    '<section id="view-community" class="view"></section>',
    '<section id="view-my" class="view"></section>',
    '</main>',
    '<nav class="bottom-nav"><button data-nav="home">首页</button><button data-nav="next">下一站</button><button data-nav="community">旅人现场</button><button data-nav="my">我的</button></nav>'
  ].join('');
  QY.renderAllPages();
  QY.assert.ok(document.querySelector('#plan-form'), '首页应渲染规划表单');
  QY.assert.ok(document.querySelectorAll('#hot-routes .hot-route-card').length >= 8, '首页应渲染热门路线');
  QY.assert.ok(document.querySelector('#community-preview'), '首页应渲染旅人现场精选');

  var input = {
    budget:4000, travellers:2, companionType:'friends', origin:'武汉', destination:'成都',
    waypoints:['重庆'], startDate:'2026-10-01', days:7,
    modes:['plane','train','coach','rental'], priority:'balanced'
  };
  QY.renderPlans(QY.generatePlans(input), input);
  QY.assert.equal(document.querySelectorAll('#view-plans .plan-card').length, 3, '应生成三套方案');
  QY.assert.ok(document.querySelector('.compare-table'), '应显示比较表');
  QY.assert.ok(document.querySelector('.provider-status'), '应显示模拟数据说明');

  QY.renderRouteDetail('wuhan-chengdu');
  QY.assert.equal(document.querySelectorAll('.route-segment').length, 2, '途径点详情应有两段');

  QY.renderCommunityPage();
  QY.assert.ok(document.querySelector('.route-topic'), '旅人现场应有路线主题');
  QY.assert.ok(document.querySelector('.post-cover'), '旅人现场应有路线图片');
  QY.assert.ok(document.body.textContent.indexOf('组队') === -1, '第一版不应显示组队入口');
  QY.store.reset();
});