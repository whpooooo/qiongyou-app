QY.test('应用骨架暴露版本号', function () {
  QY.assert.equal(QY.version, '0.1.0');
});

QY.test('导航函数可切换视图', function () {
  document.body.innerHTML = '<div id="view-home" class="view"></div><div id="view-my" class="view"></div>';
  QY.navigate('my');
  QY.assert.ok(document.getElementById('view-my').classList.contains('is-active'), '我的视图应激活');
});
QY.test('应用启动时渲染首页规划表单', function () {
  document.body.innerHTML = '<section id="view-home" class="view"></section>';
  QY.start();
  QY.assert.ok(document.querySelector('#plan-form'), '启动后应看到首页规划表单');
});