(function () {
  var root = window.QY = window.QY || {};

  function cityOptions() {
    return root.CITIES.map(function (city) {
      return '<option value="' + root.escapeHtml(city.name) + '"></option>';
    }).join('');
  }

  function collect() {
    var form = document.getElementById('surprise-form');
    return {
      origin: form.querySelector('[name="origin"]').value.trim(),
      days: Number(form.querySelector('[name="days"]').value),
      budget: Number(form.querySelector('[name="budget"]').value),
      month: form.querySelector('[name="month"]').value,
      companionType: form.querySelector('[name="companionType"]').value,
      interests: Array.from(form.querySelectorAll('[name="interests"]:checked')).map(function (input) { return input.value; }),
      startDate: '2026-' + form.querySelector('[name="month"]').value + '-01'
    };
  }

  function resultItem(item, className) {
    return [
      '<article class="' + className + '">',
      '<div class="destination-photo"><img class="destination-image" src="' + root.imageForCity(item.city.name) + '" alt="' + root.escapeHtml(item.city.name) + '风景插画"></div>',
      '<p class="eyebrow">' + (className === 'surprise-main' ? '这次去这里' : '备选目的地') + '</p>',
      '<h2>' + root.escapeHtml(item.city.name) + '</h2>',
      '<p>' + root.escapeHtml(item.reason) + '</p>',
      '<div class="metric-row"><span>总价约 ¥' + Number(item.totalCost).toLocaleString('zh-CN') + '</span><span>' + item.hours + ' 小时</span><span>' + item.transfers + ' 次换乘</span></div>',
      '<div class="tag-row">' + item.city.tags.map(function (tag) { return '<span>' + root.escapeHtml(tag) + '</span>'; }).join('') + '</div>',
      '<button type="button" class="primary-button" data-choose="' + root.escapeHtml(item.city.name) + '">就它了</button>',
      '</article>'
    ].join('');
  }

  root.renderSurprise = function (result) {
    var target = document.getElementById('surprise-result');
    if (!target || !result || !result.main) return;
    target.innerHTML = resultItem(result.main, 'surprise-main') +
      result.alternatives.map(function (item) { return resultItem(item, 'surprise-alt'); }).join('');
    target.querySelectorAll('[data-choose]').forEach(function (button) {
      button.addEventListener('click', function () {
        root.prefillPlan({ origin:collect().origin, destination:button.getAttribute('data-choose'), days:collect().days, budget:collect().budget });
      });
    });
  };

  root.prefillPlan = function (input) {
    root.navigate('home');
    var form = document.querySelector('#plan-form');
    if (!form) return;
    form.querySelector('[name="origin"]').value = input.origin || form.querySelector('[name="origin"]').value;
    form.querySelector('[name="destination"]').value = input.destination;
    form.querySelector('[name="days"]').value = input.days;
    form.querySelector('[name="budget"]').value = input.budget;
    var waypointList = form.querySelector('[data-waypoint-list]');
    waypointList.innerHTML = '';
    (input.waypoints || []).slice(0, 3).forEach(function (name) {
      waypointList.insertAdjacentHTML('beforeend', '<div class="waypoint-row"><input data-waypoint value="' + root.escapeHtml(name) + '" list="city-list"><button type="button" data-remove-waypoint>删除</button></div>');
    });
    waypointList.querySelectorAll('[data-remove-waypoint]').forEach(function (button) {
      button.onclick = function () { button.parentElement.remove(); };
    });
    form.querySelectorAll('[name="modes"]').forEach(function (inputBox) {
      inputBox.checked = (input.modes || []).indexOf(inputBox.value) >= 0;
    });
    form.querySelector('.form-error').textContent = '目的地已带入，点击下方按钮生成三套方案。';
    root.track('recommendation_accepted', { destination:input.destination, days:input.days, budget:input.budget });
  };

  function runSurprise() {
    var input = collect();
    var error = document.getElementById('surprise-error');
    if (!root.getCity(input.origin)) {
      error.textContent = '请输入城市目录中的出发城市';
      return;
    }
    error.textContent = '';
    var activeSort = document.querySelector('[data-sort].is-active');
    var sortMode = activeSort ? activeSort.getAttribute('data-sort') : 'balanced';
    var excluded = document.getElementById('surprise-result').getAttribute('data-excluded');
    var items = root.recommendDestinations(input, sortMode).filter(function (item) { return item.city.name !== excluded; });
    var result = { main:items[0], alternatives:items.slice(1, 3) };
    document.getElementById('surprise-result').setAttribute('data-excluded', result.main.city.name);
    root.track('surprise_revealed', { origin:input.origin, main:result.main.city.name });
    root.renderSurprise(result);
    document.getElementById('surprise-result').scrollIntoView({ behavior:'smooth', block:'start' });
  }

  root.renderNextTeaser = function () {
    var teaser = document.getElementById('next-teaser');
    if (!teaser) return;
    teaser.innerHTML = [
      '<section class="panel next-invite">',
      '<p class="eyebrow">下一站，未知</p>',
      '<h2>给我一个假期，还你一个没想到的目的地</h2>',
      '<p>不是随机抽签，是根据预算、位置和季节算出来的惊喜。</p>',
      '<button type="button" class="primary-button" data-open-next>给我一个惊喜</button>',
      '</section>'
    ].join('');
    teaser.querySelector('[data-open-next]').addEventListener('click', function () {
      root.track('surprise_opened', { from:'home' });
      root.navigate('next');
    });
  };

  root.renderNextPage = function () {
    var view = document.getElementById('view-next');
    if (!view) return;
    view.innerHTML = [
      '<section class="hero-card next-hero"><p class="eyebrow">下一站，未知</p><h1>给我一个假期，还你一个没想到的目的地</h1><p>选择条件后，我们给出一个有理由、能出发的惊喜。</p></section>',
      '<datalist id="next-city-list">' + cityOptions() + '</datalist>',
      '<form id="surprise-form" class="planner-card">',
      '<div class="field-grid">',
      '<label>当前所在位置<input name="origin" list="next-city-list" value="武汉"></label>',
      '<label>可出行天数<input name="days" type="number" min="1" value="5"></label>',
      '<label>总预算（元）<input name="budget" type="number" min="300" value="3000"></label>',
      '<label>出行月份<select name="month"><option value="10" selected>10 月</option><option value="11">11 月</option><option value="12">12 月</option><option value="01">1 月</option><option value="02">2 月</option><option value="03">3 月</option><option value="04">4 月</option><option value="05">5 月</option><option value="06">6 月</option></select></label>',
      '<label>同行类型<select name="companionType"><option value="solo">独自</option><option value="couple">两人</option><option value="friends" selected>朋友结伴</option><option value="family">家庭</option></select></label>',
      '</div>',
      '<fieldset><legend>兴趣偏好</legend><div class="choice-row">',
      '<label><input name="interests" type="checkbox" value="古城"> 古城</label>',
      '<label><input name="interests" type="checkbox" value="自然"> 自然</label>',
      '<label><input name="interests" type="checkbox" value="海滨"> 海滨</label>',
      '<label><input name="interests" type="checkbox" value="美食"> 美食</label>',
      '</div></fieldset>',
      '<div class="sort-row">',
      '<button type="button" data-sort="balanced" class="is-active">综合推荐</button>',
      '<button type="button" data-sort="lowestCost">花费最低</button>',
      '<button type="button" data-sort="easiestTransport">交通最省心</button>',
      '<button type="button" data-sort="bestSeason">季节最合适</button>',
      '</div>',
      '<p id="surprise-error" class="form-error" role="alert"></p>',
      '<button id="surprise-button" type="button" class="primary-button">给我一个惊喜</button>',
      '</form>',
      '<div id="surprise-result" data-excluded=""></div>'
    ].join('');
    view.querySelectorAll('[data-sort]').forEach(function (button) {
      button.addEventListener('click', function () {
        view.querySelectorAll('[data-sort]').forEach(function (item) { item.classList.remove('is-active'); });
        button.classList.add('is-active');
      });
    });
    view.querySelector('#surprise-button').addEventListener('click', runSurprise);
  };
}());