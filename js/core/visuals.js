(function () {
  var root = window.QY = window.QY || {};
  var cityImage = {
    '上海':'assets/images/route-city.svg', '重庆':'assets/images/route-city.svg', '广州':'assets/images/route-city.svg',
    '青岛':'assets/images/route-coast.svg', '厦门':'assets/images/route-coast.svg', '三亚':'assets/images/route-coast.svg', '北海':'assets/images/route-coast.svg',
    '苏州':'assets/images/route-garden.svg', '杭州':'assets/images/route-garden.svg', '扬州':'assets/images/route-garden.svg', '无锡':'assets/images/route-garden.svg',
    '张家界':'assets/images/route-mountain.svg', '黄山':'assets/images/route-mountain.svg', '稻城':'assets/images/route-mountain.svg', '九寨沟':'assets/images/route-mountain.svg', '恩施':'assets/images/route-mountain.svg', '桂林':'assets/images/route-mountain.svg',
    '呼伦贝尔':'assets/images/route-grassland.svg', '伊犁':'assets/images/route-grassland.svg',
    '敦煌':'assets/images/route-desert.svg', '喀什':'assets/images/route-desert.svg', '嘉峪关':'assets/images/route-desert.svg',
    '拉萨':'assets/images/route-plateau.svg', '西宁':'assets/images/route-plateau.svg', '格尔木':'assets/images/route-plateau.svg',
    '西安':'assets/images/route-old-town.svg', '洛阳':'assets/images/route-old-town.svg', '平遥':'assets/images/route-old-town.svg', '大同':'assets/images/route-old-town.svg', '开封':'assets/images/route-old-town.svg', '泉州':'assets/images/route-old-town.svg',
    '丽江':'assets/images/route-garden.svg', '大理':'assets/images/route-garden.svg', '昆明':'assets/images/route-garden.svg'
  };
  root.VISUALS = { hero:'assets/images/hero-journey.svg', cityImage:cityImage };
  root.imageForCity = function (name) { return cityImage[name] || 'assets/images/route-mountain.svg'; };
  root.imageForRoute = function (route) { return route.image || root.imageForCity(route.destination); };
}());