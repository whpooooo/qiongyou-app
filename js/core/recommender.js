(function () {
  var root = window.QY = window.QY || {};

  function travellersFor(type) {
    if (type === 'solo') return 1;
    if (type === 'couple') return 2;
    if (type === 'family') return 3;
    return 2;
  }

  function monthOf(input) {
    if (input.month) return String(input.month).padStart(2, '0');
    if (input.startDate) return String(new Date(input.startDate).getMonth() + 1).padStart(2, '0');
    return String(new Date().getMonth() + 1).padStart(2, '0');
  }

  function estimateForCity(city, input) {
    var plans = root.generatePlans({
      budget: input.budget,
      travellers: travellersFor(input.companionType),
      companionType: input.companionType,
      origin: input.origin,
      destination: city.name,
      waypoints: [],
      startDate: input.startDate || '2026-10-01',
      days: input.days,
      modes: ['plane', 'train', 'coach'],
      priority: 'balanced'
    });
    return plans[1];
  }

  function scoreCity(city, input, plan) {
    var month = monthOf(input);
    var travellers = travellersFor(input.companionType);
    var budgetFit = root.clamp(1 - plan.totalCost.normal / Math.max(Number(input.budget) * 1.35, 1), 0, 1);
    var transportEase = root.clamp(1 - (plan.transfers * 0.12 + plan.totalHours / 80), 0, 1);
    var seasonal = city.bestMonths.indexOf(month) >= 0 ? 1 : 0.55;
    var interestFit = (input.interests || []).some(function (tag) { return city.tags.indexOf(tag) >= 0; }) ? 1 : 0.65;
    var groupFit = input.companionType === 'family' && city.tags.some(function (tag) { return ['登山', '徒步', '沙漠'].indexOf(tag) >= 0; }) ? 0.65 : 0.9;
    var score = budgetFit * 0.28 + transportEase * 0.22 + seasonal * 0.2 + groupFit * 0.12 + interestFit * 0.18;
    var reason = month + ' 月' + (seasonal === 1 ? '正合适' : '可出行') + '，预计人均约 ' + root.roundMoney(plan.totalCost.normal / travellers) + ' 元，' +
      (plan.transfers === 0 ? '换乘少' : '全程约 ' + plan.transfers + ' 次换乘') + '，' + city.tags.slice(0, 2).join('、') + '适合你。';
    return {
      city: city,
      totalCost: plan.totalCost.normal,
      hours: plan.totalHours,
      transfers: plan.transfers,
      seasonal: seasonal,
      score: Math.round(score * 1000) / 1000,
      reason: reason
    };
  }

  root.recommendDestinations = function (input, sortMode) {
    var results = root.CITIES.filter(function (city) {
      return city.type === 'tourist' && city.name !== input.origin;
    }).map(function (city) {
      return scoreCity(city, input, estimateForCity(city, input));
    });

    results.sort(function (a, b) {
      if (sortMode === 'lowestCost') return a.totalCost - b.totalCost || b.score - a.score;
      if (sortMode === 'easiestTransport') return a.transfers - b.transfers || a.hours - b.hours || b.score - a.score;
      if (sortMode === 'bestSeason') return b.seasonal - a.seasonal || b.score - a.score;
      return b.score - a.score;
    });
    return results;
  };

  root.surpriseDestinations = function (input, excludedCity) {
    var results = root.recommendDestinations(input, 'balanced').filter(function (item) {
      return item.city.name !== excludedCity;
    });
    return { main: results[0], alternatives: results.slice(1, 3) };
  };
}());