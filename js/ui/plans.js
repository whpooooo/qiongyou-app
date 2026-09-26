(function () {
  var root = window.QY = window.QY || {};

  function money(value) { return Number(value).toLocaleString('zh-CN'); }

  function planCard(plan) {
    return [
      '<article class="plan-card" data-strategy="' + plan.strategy + '">',
      '<div class="plan-head"><span>' + plan.label + '</span><small class="data-source">' + plan.dataSource + '</small></div>',
      '<strong class="plan-price">¥' + money(plan.totalCost.normal) + '</strong>',
      '<p>预计区间 ¥' + money(plan.totalCost.min) + '～¥' + money(plan.totalCost.normal) + '</p>',
      '<div class="metric-row"><span>' + plan.totalHours + ' 小时</span><span>' + plan.transfers + ' 次换乘</span><span>' + plan.latestArrival + '</span></div>',
      '<p class="route-chain">' + plan.route.map(root.escapeHtml).join(' → ') + '</p>',
      '<p class="provider-status">' + root.escapeHtml(root.provider.statusMessage) + '</p>',
      '<div class="plan-actions"><button type="button" class="secondary-button" data-save-plan="' + plan.id + '">保存这套方案</button><button type="button" class="text-button" data-booking="' + plan.id + '">查看购票入口</button></div>',
      '</article>'
    ].join('');
  }

  function compareTable(plans) {
    var rows = [
      ['总费用', plans.map(function (plan) { return '¥' + money(plan.totalCost.normal); })],
      ['总耗时', plans.map(function (plan) { return plan.totalHours + ' 小时'; })],
      ['换乘', plans.map(function (plan) { return plan.transfers + ' 次'; })],
      ['最晚到达', plans.map(function (plan) { return plan.latestArrival; })],
      ['预算结余', plans.map(function (plan) { return (plan.budgetBalance >= 0 ? '余 ¥' : '超 ¥') + money(Math.abs(plan.budgetBalance)); })]
    ];
    return '<div class="table-scroll"><table class="compare-table"><thead><tr><th>指标</th>' +
      plans.map(function (plan) { return '<th>' + plan.label + '</th>'; }).join('') +
      '</tr></thead><tbody>' + rows.map(function (row) {
        return '<tr><th>' + row[0] + '</th>' + row[1].map(function (cell) { return '<td>' + cell + '</td>'; }).join('') + '</tr>';
      }).join('') + '</tbody></table></div>';
  }

  root.renderPlans = function (plans, input) {
    var view = document.getElementById('view-plans');
    if (!view) return;
    view.innerHTML = [
      '<div class="section-head"><div><p class="eyebrow">' + root.escapeHtml(input.origin) + ' → ' + root.escapeHtml(input.destination) + '</p><h1>三套方案，由你决定</h1></div><button type="button" class="text-button" data-back-home>修改条件</button></div>',
      '<div class="plan-list">' + plans.map(planCard).join('') + '</div>',
      '<h2>横向比较</h2>',
      compareTable(plans)
    ].join('');
    view.querySelector('[data-back-home]').addEventListener('click', function () { root.navigate('home'); });
    view.querySelectorAll('[data-save-plan]').forEach(function (button) {
      button.addEventListener('click', function () {
        var plan = plans.find(function (item) { return item.id === button.getAttribute('data-save-plan'); });
        root.store.savePlan({ id:plan.id, title:input.origin + '到' + input.destination, routeId:input.origin + '-' + input.destination, plan:plan, input:input });
        root.track('plan_saved', { strategy:plan.strategy });
        button.textContent = '已保存';
        button.disabled = true;
      });
    });
    view.querySelectorAll('[data-booking]').forEach(function (button) {
      button.addEventListener('click', function () {
        var plan = plans.find(function (item) { return item.id === button.getAttribute('data-booking'); });
        var action = root.provider.bookingAction(plan);
        root.track('booking_clicked', { strategy:plan.strategy, enabled:action.enabled });
        root.showToast(action.label);
      });
    });
  };
}());