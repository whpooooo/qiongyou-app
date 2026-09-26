(function () {
  var root = window.QY = window.QY || {};

  function cityOptions() {
    return root.CITIES.map(function (city) {
      return '<option value="' + root.escapeHtml(city.name) + '">' + root.escapeHtml(city.name) + '</option>';
    }).join('');
  }

  function waypointRow(value) {
    return '<div class="waypoint-row"><input data-waypoint value="' + root.escapeHtml(value || '') + '" list="city-list" placeholder="途径点城市"><button type="button" data-remove-waypoint>删除</button></div>';
  }

  function bindWaypoints(form) {
    form.querySelector('[data-add-waypoint]').addEventListener('click', function () {
      var list = form.querySelector('[data-waypoint-list]');
      if (list.querySelectorAll('[data-waypoint]').length >= 3) {
        form.querySelector('.form-error').textContent = '途径点最多 3 个';
        return;
      }
      list.insertAdjacentHTML('beforeend', waypointRow(''));
      bindRemoveButtons(form);
    });
    bindRemoveButtons(form);
  }

  function bindRemoveButtons(form) {
    form.querySelectorAll('[data-remove-waypoint]').forEach(function (button) {
      button.onclick = function () { button.parentElement.remove(); };
    });
  }

  root.collectPlanInput = function (form) {
    return {
      budget: Number(form.querySelector('[name="budget"]').value),
      travellers: Number(form.querySelector('[name="travellers"]').value),
      companionType: form.querySelector('[name="companionType"]').value,
      origin: form.querySelector('[name="origin"]').value,
      destination: form.querySelector('[name="destination"]').value,
      waypoints: Array.from(form.querySelectorAll('[data-waypoint]')).map(function (input) { return input.value.trim(); }).filter(Boolean),
      startDate: form.querySelector('[name="startDate"]').value,
      days: Number(form.querySelector('[name="days"]').value),
      modes: Array.from(form.querySelectorAll('[name="modes"]:checked')).map(function (input) { return input.value; }),
      priority: form.querySelector('[name="priority"]:checked').value
    };
  };

  root.showPlans = function (input) {
    var validation = root.validatePlanInput(input);
    var view = document.getElementById('view-home');
    var error = view.querySelector('.form-error');
    if (!validation.valid) {
      error.textContent = validation.errors.join('；');
      return false;
    }
    var plans;
    try {
      plans = root.generatePlans(input);
    } catch (error) {
      error.textContent = '暂时无法生成方案：' + error.message;
      return false;
    }
    root.track('plans_generated', { origin:input.origin, destination:input.destination, days:input.days });
    root.renderPlans(plans, input);
    root.navigate('plans');
    return true;
  };

  root.renderHome = function () {
    var view = document.getElementById('view-home');
    if (!view) return;
    view.innerHTML = [
      '<section class="hero-card hero-with-image">',
      '<div class="hero-visual"><img src="' + root.VISUALS.hero + '" alt="山河与旅行路线插画"></div>',
      '<div class="hero-copy"><p class="eyebrow">预算有限，也能去很远</p>',
      '<h1>把假期、预算和出发地交给我们</h1>',
      '<p>一分钟生成三套能直接比较的穷游方案。</p></div>',
      '</section>',
      '<datalist id="city-list">' + cityOptions() + '</datalist>',
      '<form id="plan-form" class="planner-card" novalidate>',
      '<div class="field-grid">',
      '<label>总预算（元）<input name="budget" type="number" min="100" value="3000"></label>',
      '<label>人数<input name="travellers" type="number" min="1" value="2"></label>',
      '<label>同行类型<select name="companionType"><option value="solo">独自</option><option value="couple">两人</option><option value="friends" selected>朋友结伴</option><option value="family">家庭</option></select></label>',
      '<label>出发地<input name="origin" list="city-list" value="武汉"></label>',
      '<label>目的地<input name="destination" list="city-list" value="成都"></label>',
      '<label>出发日期<input name="startDate" type="date" value="2026-10-01"></label>',
      '<label>旅行天数<input name="days" type="number" min="1" value="7"></label>',
      '</div>',
      '<fieldset><legend>交通方式</legend><div class="choice-row">',
      '<label><input type="checkbox" name="modes" value="plane" checked> 飞机</label>',
      '<label><input type="checkbox" name="modes" value="train" checked> 火车</label>',
      '<label><input type="checkbox" name="modes" value="coach" checked> 长途客车</label>',
      '<label><input type="checkbox" name="modes" value="rental"> 租车</label>',
      '</div></fieldset>',
      '<fieldset><legend>优先偏好</legend><div class="choice-row">',
      '<label><input type="radio" name="priority" value="cheapest"> 省钱</label>',
      '<label><input type="radio" name="priority" value="balanced" checked> 平衡</label>',
      '<label><input type="radio" name="priority" value="fastest"> 省时</label>',
      '</div></fieldset>',
      '<section class="waypoint-box"><div><strong>途径点</strong><p>最多添加三个城市</p></div><button type="button" data-add-waypoint>添加途径点</button><div data-waypoint-list></div></section>',
      '<p class="form-error" role="alert"></p>',
      '<button class="primary-button" type="submit">生成 3 套穷游方案</button>',
      '</form>'
    ].join('');
    bindWaypoints(view.querySelector('#plan-form'));
    view.querySelector('#plan-form').addEventListener('submit', function (event) {
      event.preventDefault();
      root.showPlans(root.collectPlanInput(event.currentTarget));
    });
    var teaser = document.createElement('div');
    teaser.id = 'next-teaser';
    view.appendChild(teaser);
    if (root.renderNextTeaser) root.renderNextTeaser();
    if (root.renderHotRoutes) root.renderHotRoutes();
    if (root.renderCommunityPreview) root.renderCommunityPreview();
  };
}());