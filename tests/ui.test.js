QY.test('首页渲染直接可见的规划表单', function () {
  document.body.innerHTML = '<section id="view-home"></section><section id="view-plans"></section>';
  QY.renderHome();
  QY.assert.ok(document.querySelector('#plan-form'), '应存在规划表单');
  QY.assert.ok(document.body.textContent.indexOf('生成 3 套穷游方案') >= 0, '应显示主按钮');
  QY.assert.ok(document.querySelectorAll('[data-waypoint]').length === 0, '初始不显示途径点输入框');
});

QY.test('方案界面渲染三张卡片和比较表', function () {
  document.body.innerHTML = '<section id="view-home"></section><section id="view-plans"></section>';
  var input = {
    budget:4000, travellers:2, companionType:'friends', origin:'武汉', destination:'成都',
    waypoints:['重庆'], startDate:'2026-10-01', days:7,
    modes:['plane','train','coach','rental'], priority:'balanced'
  };
  QY.renderPlans(QY.generatePlans(input), input);
  QY.assert.equal(document.querySelectorAll('.plan-card').length, 3, '应渲染三张方案卡');
  QY.assert.ok(document.querySelector('.compare-table'), '应渲染比较表');
  QY.assert.ok(document.querySelector('.data-source').textContent.indexOf('模拟预估') >= 0, '应标明模拟数据');
});
QY.test('规划表单在 390 像素宽度下不横向溢出', function () {
  document.body.innerHTML = '<section id="view-home" class="view is-active"></section><section id="view-plans" class="view"></section>';
  QY.renderHome();
  var grid = document.querySelector('.field-grid');
  QY.assert.ok(grid.scrollWidth <= grid.clientWidth, '表单字段不应超出手机视口');
  QY.assert.ok(document.documentElement.scrollWidth <= window.innerWidth, '页面宽度不应超过视口');
});
QY.test('首页主视觉包含图片和替代文字', function () {
  document.body.innerHTML = '<section id="view-home"></section><section id="view-plans"></section>';
  QY.renderHome();
  var image = document.querySelector('.hero-visual img');
  QY.assert.ok(image, '首页主视觉应包含图片');
  QY.assert.ok(image.getAttribute('alt'), '首页主视觉图片应有替代文字');
});