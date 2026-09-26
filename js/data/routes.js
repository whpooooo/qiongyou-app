(function () {
  window.QY = window.QY || {};
  window.QY.HOT_ROUTES = [
    { id:'wuhan-chengdu', title:'从江城吃到天府', origin:'武汉', waypoints:['重庆'], destination:'成都', days:7, budget:2100, modes:['train','coach'] },
    { id:'guangzhou-chengdu', title:'岭南到巴蜀的慢火车', origin:'广州', waypoints:['重庆'], destination:'成都', days:8, budget:2600, modes:['train','plane'] },
    { id:'xian-dunhuang', title:'沿着河西走廊向西', origin:'西安', waypoints:['兰州'], destination:'敦煌', days:8, budget:2500, modes:['train','coach'] },
    { id:'beijing-xian', title:'古都串烧省钱线', origin:'北京', waypoints:['大同','平遥'], destination:'西安', days:9, budget:2800, modes:['train','coach'] },
    { id:'nanjing-shanghai', title:'园林与城市三日慢游', origin:'南京', waypoints:['苏州'], destination:'上海', days:5, budget:1600, modes:['train'] },
    { id:'kunming-lijiang', title:'云南慢旅行', origin:'昆明', waypoints:['大理'], destination:'丽江', days:7, budget:2200, modes:['train','coach'] },
    { id:'xining-lhasa', title:'高原列车向前', origin:'西宁', waypoints:['格尔木'], destination:'拉萨', days:9, budget:3300, modes:['train'] },
    { id:'xiamen-quanzhou', title:'闽南古城与海边', origin:'厦门', waypoints:['泉州'], destination:'青岛', days:9, budget:3000, modes:['train','plane'] },
    { id:'chengdu-daocheng', title:'川西雪山长线', origin:'成都', waypoints:['康定'], destination:'稻城', days:8, budget:2600, modes:['coach','rental'] }
  ];
  var routeImages = {
    'wuhan-chengdu':'assets/images/route-old-town.svg',
    'guangzhou-chengdu':'assets/images/route-city.svg',
    'xian-dunhuang':'assets/images/route-desert.svg',
    'beijing-xian':'assets/images/route-old-town.svg',
    'nanjing-shanghai':'assets/images/route-garden.svg',
    'kunming-lijiang':'assets/images/route-garden.svg',
    'xining-lhasa':'assets/images/route-plateau.svg',
    'xiamen-quanzhou':'assets/images/route-coast.svg',
    'chengdu-daocheng':'assets/images/route-mountain.svg'
  };
  window.QY.HOT_ROUTES.forEach(function (route) { route.image = routeImages[route.id]; });
  window.QY.getHotRoute = function (id) {
    return window.QY.HOT_ROUTES.find(function (route) { return route.id === id; }) || null;
  };
}());