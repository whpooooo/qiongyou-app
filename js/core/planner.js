(function () {
  var root = window.QY = window.QY || {};

  function unique(values) {
    return values.filter(function (value, index) { return values.indexOf(value) === index; });
  }

  root.validatePlanInput = function (input) {
    input = input || {};
    var errors = [];
    if (!(Number(input.budget) > 0)) errors.push('请输入有效预算');
    if (!(Number(input.travellers) >= 1)) errors.push('请输入有效人数');
    if (!input.origin) errors.push('请选择出发地');
    if (!input.destination) errors.push('请选择目的地');
    if (input.origin && input.destination && input.origin === input.destination) errors.push('出发地和目的地不能相同');
    if (!input.startDate) errors.push('请选择出发日期');
    if (!(Number(input.days) >= 1)) errors.push('请输入有效旅行天数');
    if (!input.modes || !input.modes.length) errors.push('请至少选择一种交通方式');
    var waypoints = input.waypoints || [];
    if (waypoints.length > 3) errors.push('途径点最多 3 个');
    if (unique(waypoints).length !== waypoints.length) errors.push('途径点不能重复');
    if (waypoints.indexOf(input.origin) >= 0 || waypoints.indexOf(input.destination) >= 0) errors.push('途径点不能与出发地或目的地重复');
    return { valid: errors.length === 0, errors: errors };
  };

  function modeAvailable(mode, km) {
    if (mode === 'plane') return km >= 450;
    if (mode === 'train') return km >= 120;
    if (mode === 'coach') return km <= 1500;
    if (mode === 'rental') return km >= 60;
    return false;
  }

  root.estimateLeg = function (fromName, toName, mode, travellers) {
    var km = Math.max(30, Math.round(root.haversine(root.getCity(fromName), root.getCity(toName)) * 1.22));
    var people = Math.max(1, Number(travellers) || 1);
    var costPerPerson = 0;
    var groupCost = 0;
    var hours = 0;
    var transfers = 0;

    if (mode === 'plane') {
      costPerPerson = 260 + km * 0.55;
      hours = 2.2 + km / 750;
      transfers = 1;
    } else if (mode === 'train') {
      costPerPerson = 40 + km * 0.32;
      hours = 0.8 + km / 220;
      transfers = km > 1000 ? 1 : 0;
    } else if (mode === 'coach') {
      costPerPerson = 25 + km * 0.28;
      hours = 0.5 + km / 75;
      transfers = km > 800 ? 1 : 0;
    } else {
      groupCost = 220 + km * 1.7;
      hours = 0.5 + km / 80;
      transfers = 0;
    }

    return {
      from: fromName,
      to: toName,
      mode: mode,
      modeLabel: root.CONST.MODE_LABELS[mode],
      km: km,
      cost: root.roundMoney(groupCost || costPerPerson * people),
      hours: Math.round(hours * 10) / 10,
      transfers: transfers
    };
  };

  function chooseMode(distance, available, strategy) {
    var orders = {
      cheapest: ['coach', 'train', 'plane', 'rental'],
      balanced: ['train', 'plane', 'coach', 'rental'],
      fastest: ['plane', 'train', 'rental', 'coach']
    };
    var mode = orders[strategy].find(function (item) {
      return available.indexOf(item) >= 0 && modeAvailable(item, distance);
    });
    return mode || available[0];
  }

  function latestArrival(hours) {
    var minutes = Math.round((6.5 * 60 + hours * 60) % (24 * 60));
    var hh = String(Math.floor(minutes / 60)).padStart(2, '0');
    var mm = String(minutes % 60).padStart(2, '0');
    return '约 ' + hh + ':' + mm;
  }

  function buildPlan(input, strategy) {
    var route = [input.origin].concat(input.waypoints || []).concat(input.destination);
    var labels = { cheapest: '极限省钱', balanced: '均衡推荐', fastest: '省时优先' };
    var travellers = Number(input.travellers);
    var segments = [];

    for (var index = 0; index < route.length - 1; index += 1) {
      var from = route[index];
      var to = route[index + 1];
      var distance = root.haversine(root.getCity(from), root.getCity(to)) * 1.22;
      var mode = chooseMode(distance, input.modes, strategy);
      segments.push(root.estimateLeg(from, to, mode, travellers));
    }

    var intercity = segments.reduce(function (sum, segment) { return sum + segment.cost; }, 0);
    var nights = Math.max(0, Number(input.days) - 1);
    var standards = {
      cheapest: { stay: 80, food: 60, local: 15, other: 40 },
      balanced: { stay: 130, food: 90, local: 25, other: 80 },
      fastest: { stay: 220, food: 140, local: 40, other: 140 }
    }[strategy];
    var costs = {
      intercity: intercity,
      stay: standards.stay * nights * travellers,
      food: standards.food * Number(input.days) * travellers,
      local: standards.local * Number(input.days) * travellers,
      other: standards.other * travellers
    };
    var normal = root.roundMoney(Object.keys(costs).reduce(function (sum, key) { return sum + costs[key]; }, 0));
    var minimum = root.roundMoney(normal * 0.9);
    var totalHours = Math.round(segments.reduce(function (sum, segment) { return sum + segment.hours; }, 0) * 10) / 10;

    return {
      id: strategy + '-' + Date.now() + '-' + Math.random().toString(16).slice(2, 8),
      strategy: strategy,
      label: labels[strategy],
      totalCost: { min: minimum, normal: normal },
      budgetBalance: Math.round((Number(input.budget) - normal) / 10) * 10,
      totalHours: totalHours,
      transfers: segments.reduce(function (sum, segment) { return sum + segment.transfers; }, 0),
      latestArrival: latestArrival(totalHours),
      route: route,
      segments: segments,
      costs: costs,
      daily: Array.from({ length: Number(input.days) }, function (_, index) {
        return { day: index + 1, title: index === 0 ? '出发日' : index === Number(input.days) - 1 ? '返程准备' : '游览与移动', note: index < segments.length ? segments[index].from + ' → ' + segments[index].to : '按计划游览和休息' };
      }),
      dataSource: '模拟预估'
    };
  }

  root.generatePlans = function (input) {
    var validation = root.validatePlanInput(input);
    if (!validation.valid) throw new Error(validation.errors.join('；'));
    return ['cheapest', 'balanced', 'fastest'].map(function (strategy) { return buildPlan(input, strategy); });
  };
}());