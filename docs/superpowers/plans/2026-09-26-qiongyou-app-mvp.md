# 穷游路线规划 Web 原型 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个手机优先、无需构建工具即可运行的静态 Web 原型，用于生成并比较三套穷游路线、推荐惊喜目的地、展示带途径点的热门路线，以及按路线聚合同行经验。

**Architecture:** 使用经典 `script` 标签加载原生 JavaScript，所有模块挂载到 `window.QY` 命名空间，避免 `file://` 下的模块加载限制。核心算法、数据、状态和界面渲染分为独立文件；浏览器本地存储负责保存方案、收藏和模拟互动。测试由独立 `tests/test-runner.html` 驱动，通过 Edge 无头模式读取 `--dump-dom` 输出。

**Tech Stack:** HTML5、CSS3、原生 JavaScript ES2018、Web Storage、Microsoft Edge Headless、PowerShell。

**Spec:** `docs/superpowers/specs/2026-09-26-qiongyou-app-mvp-design.md`

## Global Constraints

- 第一版是手机优先的静态 Web 原型，不使用 Node、Python、React、Vue 或任何构建工具。
- 页面必须可以直接从本地文件打开，不依赖网络请求。
- 第一版不开放组队和实名认证，不显示组队入口。
- 第一版不处理站内支付、订单、退改签或售后。
- 热门路线和路线规划支持最多 3 个途径点。
- 底部导航固定为“首页、下一站、旅人现场、我的”。
- 首页首屏直接提供规划表单，核心按钮文字固定为“生成 3 套穷游方案”。
- 推荐模块标题固定为“下一站，未知”，主按钮固定为“给我一个惊喜”。
- 社区标题固定为“旅人现场”，副标题固定为“只看真去过的人怎么说”。
- 三套方案固定为“极限省钱、均衡推荐、省时优先”，由用户自行比较。
- 所有模拟估算必须显示“模拟预估”，不得伪装成实时数据。
- 城市范围包含所有省级行政中心省会、首府、直辖市，以及热门旅游城市；道路和路线为原型模拟估算。
- 移动端最小验收宽度为 360px，主要按钮最小高度为 48px。
- 首页、热门路线、“下一站，未知”、路线详情和社区精选必须使用本地 SVG 风景图。
- 图片必须包含替代文字，并保留加载失败时的可读背景。
- 返回、空状态、加载状态和接口失败状态必须有明确文字，不使用空白页面。
- 当前环境没有 Git；每个任务末尾的提交命令仅在 Git 安装后执行，当前以测试通过作为任务检查点。

## 测试命令

从项目根目录运行：

```powershell
$uri = [System.Uri]::new((Resolve-Path '.\tests\test-runner.html').Path).AbsoluteUri
& 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe' --headless=new --disable-gpu --allow-file-access-from-files --dump-dom $uri
```

预期输出包含：

```text
TEST_RESULTS: PASS <数量> FAIL 0
```

首次运行 Edge 可能需要用户批准启动图形程序的无头进程。

## File Structure

- `index.html`：应用外壳、根视图容器和脚本加载顺序。
- `styles.css`：移动优先视觉系统、响应式布局和状态样式。
- `js/app.js`：应用启动、底部导航和视图切换。
- `js/core/constants.js`：交通方式、策略、存储键和固定文案。
- `js/core/utils.js`：格式化、距离、数值限制和路线键工具。
- `js/core/store.js`：本地存储读写、内存回退和状态操作。
- `js/core/planner.js`：输入校验、分段估算和三套方案生成。
- `js/core/recommender.js`：目的地筛选、评分、排序和揭晓结果。
- `js/core/community.js`：路线经验聚合、模拟发布和互动。
- `js/core/analytics.js`：本地行为记录。
- `js/core/provider.js`：模拟数据提供器和未来实时接口边界。
- `js/core/visuals.js`：城市、路线与图片的映射。
- `assets/images`：本地 SVG 风景插画。
- `js/data/cities.js`：城市目录和坐标。
- `js/data/routes.js`：热门路线和途径点。
- `js/data/community.js`：初始路线主题、攻略和讨论。
- `js/ui/home.js`：首页规划表单和内容摘要。
- `js/ui/plans.js`：方案卡和比较表渲染。
- `js/ui/next.js`：“下一站，未知”筛选和揭晓界面。
- `js/ui/routes.js`：热门路线卡片、途径点详情和带入规划。
- `js/ui/community.js`：“旅人现场”列表、详情和发布界面。
- `js/ui/my.js`：“我的”、保存方案和收藏界面。
- `tests/assert.js`：无依赖测试注册、断言和结果输出。
- `tests/test-runner.html`：加载源码与全部测试文件。
- `tests/smoke.test.js`：应用骨架测试。
- `tests/planner.test.js`：校验、途径点和三套方案测试。
- `tests/recommender.test.js`：筛选、排序和揭晓测试。
- `tests/community.test.js`：路线聚合和模拟互动测试。
- `tests/store.test.js`：本地保存和收藏测试。
- `tests/ui.test.js`：首页和方案界面测试。
- `tests/next-ui.test.js`：惊喜推荐界面测试。
- `tests/routes-ui.test.js`：热门路线与途径点界面测试。
- `tests/community-ui.test.js`：社区和我的页面测试。
- `tests/provider.test.js`：数据提供器与行为记录测试。
- `tests/e2e.test.js`：完整主流程测试。
- `README.md`：运行方式、测试方式和当前范围。

---

### Task 1: 应用骨架与测试运行器

**Files:**
- Create: `tests/assert.js`
- Create: `tests/smoke.test.js`
- Create: `tests/test-runner.html`
- Create: `js/app.js`
- Create: `index.html`
- Create: `styles.css`

**Interfaces:**
- Consumes: 无。
- Produces: `QY.version: string`、`QY.test(name, fn)`、`QY.assert.equal(actual, expected, message)`、`QY.navigate(viewName)`。

- [ ] **Step 1: 写失败测试和测试运行器**

创建 `tests/assert.js`：

```javascript
(function () {
  var root = window.QY = window.QY || {};
  var tests = [];
  var failures = [];

  root.assert = {
    equal: function (actual, expected, message) {
      if (actual !== expected) {
        throw new Error((message || '值不相等') + '：expected=' + expected + ' actual=' + actual);
      }
    },
    deepEqual: function (actual, expected, message) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error((message || '结构不相等') + '：expected=' + JSON.stringify(expected) + ' actual=' + JSON.stringify(actual));
      }
    },
    ok: function (value, message) {
      if (!value) {
        throw new Error(message || '预期值应为真');
      }
    }
  };

  root.test = function (name, fn) {
    tests.push({ name: name, fn: fn });
  };

  root.runTests = function () {
    failures = [];
    tests.forEach(function (item) {
      try {
        item.fn();
      } catch (error) {
        failures.push(item.name + '：' + error.message);
      }
    });
    var summary = document.createElement('div');
    summary.id = 'test-summary';
    summary.textContent = 'TEST_RESULTS: PASS ' + (tests.length - failures.length) + ' FAIL ' + failures.length;
    document.body.appendChild(summary);
    if (failures.length) {
      var list = document.createElement('pre');
      list.id = 'test-failures';
      list.textContent = failures.join('\n');
      document.body.appendChild(list);
    }
  };
}());
```

创建 `tests/smoke.test.js`：

```javascript
QY.test('应用骨架暴露版本号', function () {
  QY.assert.equal(QY.version, '0.1.0');
});

QY.test('导航函数可切换视图', function () {
  document.body.innerHTML = '<div id="view-home" class="view"></div><div id="view-my" class="view"></div>';
  QY.navigate('my');
  QY.assert.ok(document.getElementById('view-my').classList.contains('is-active'), '我的视图应激活');
});
```

创建 `tests/test-runner.html`：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <title>QY Tests</title>
</head>
<body>
  <script src="../tests/assert.js"></script>
  <script src="../js/app.js"></script>
  <script src="../tests/smoke.test.js"></script>
  <script src="../tests/planner.test.js" onerror="void 0"></script>
  <script src="../tests/recommender.test.js" onerror="void 0"></script>
  <script src="../tests/community.test.js" onerror="void 0"></script>
  <script src="../tests/store.test.js" onerror="void 0"></script>
  <script>window.addEventListener('DOMContentLoaded', QY.runTests);</script>
</body>
</html>
```

- [ ] **Step 2: 运行测试并确认失败**

Run:

```powershell
$uri = [System.Uri]::new((Resolve-Path '.\tests\test-runner.html').Path).AbsoluteUri
& 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe' --headless=new --disable-gpu --allow-file-access-from-files --dump-dom $uri
```

Expected: 输出包含 `TEST_RESULTS: PASS 0 FAIL 2`，因为 `QY.version` 和 `QY.navigate` 尚不存在。

- [ ] **Step 3: 实现最小应用骨架**

创建 `js/app.js`：

```javascript
(function () {
  var root = window.QY = window.QY || {};
  root.version = '0.1.0';

  root.navigate = function (viewName) {
    document.querySelectorAll('.view').forEach(function (view) {
      view.classList.toggle('is-active', view.id === 'view-' + viewName);
    });
    document.querySelectorAll('[data-nav]').forEach(function (button) {
      button.classList.toggle('is-active', button.getAttribute('data-nav') === viewName);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  root.start = function () {
    document.querySelectorAll('[data-nav]').forEach(function (button) {
      button.addEventListener('click', function () {
        root.navigate(button.getAttribute('data-nav'));
      });
    });
    root.navigate('home');
  };

  window.addEventListener('DOMContentLoaded', root.start);
}());
```

创建 `index.html`：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#ff5a36">
  <title>下一站，未知</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="topbar"><strong>下一站，未知</strong><span>模拟原型</span></header>
  <main>
    <section id="view-home" class="view is-active" aria-label="首页"></section>
    <section id="view-next" class="view" aria-label="下一站"></section>
    <section id="view-community" class="view" aria-label="旅人现场"></section>
    <section id="view-my" class="view" aria-label="我的"></section>
  </main>
  <nav class="bottom-nav" aria-label="主导航">
    <button data-nav="home" class="is-active">首页</button>
    <button data-nav="next">下一站</button>
    <button data-nav="community">旅人现场</button>
    <button data-nav="my">我的</button>
  </nav>
  <script src="js/core/constants.js" onerror="void 0"></script>
  <script src="js/core/utils.js" onerror="void 0"></script>
  <script src="js/data/cities.js" onerror="void 0"></script>
  <script src="js/data/routes.js" onerror="void 0"></script>
  <script src="js/data/community.js" onerror="void 0"></script>
  <script src="js/core/store.js" onerror="void 0"></script>
  <script src="js/core/planner.js" onerror="void 0"></script>
  <script src="js/core/recommender.js" onerror="void 0"></script>
  <script src="js/core/community.js" onerror="void 0"></script>
  <script src="js/ui/home.js" onerror="void 0"></script>
  <script src="js/ui/plans.js" onerror="void 0"></script>
  <script src="js/ui/next.js" onerror="void 0"></script>
  <script src="js/ui/community.js" onerror="void 0"></script>
  <script src="js/ui/my.js" onerror="void 0"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

创建 `styles.css` 的基础部分：

```css
:root {
  --ink: #17211b;
  --muted: #66736b;
  --paper: #fffdf8;
  --card: #ffffff;
  --brand: #ff5a36;
  --brand-dark: #d83f20;
  --accent: #f7c948;
  --line: #e6e9e5;
  --shadow: 0 12px 34px rgba(23, 33, 27, 0.1);
}

* { box-sizing: border-box; }
html { background: #f2f4ef; color: var(--ink); font-family: "Microsoft YaHei", sans-serif; }
body { margin: 0 auto; max-width: 520px; min-height: 100vh; background: var(--paper); padding-bottom: 84px; }
button, input, select { font: inherit; }
button { min-height: 48px; border: 0; border-radius: 16px; cursor: pointer; }
.topbar { position: sticky; top: 0; z-index: 10; display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; background: rgba(255,253,248,.94); backdrop-filter: blur(12px); }
.topbar span { color: var(--brand); font-size: 12px; font-weight: 700; }
.view { display: none; padding: 18px; }
.view.is-active { display: block; }
.bottom-nav { position: fixed; left: 50%; bottom: 0; z-index: 20; display: grid; grid-template-columns: repeat(4, 1fr); width: min(520px, 100%); transform: translateX(-50%); padding: 8px 10px max(8px, env(safe-area-inset-bottom)); background: rgba(255,255,255,.96); border-top: 1px solid var(--line); backdrop-filter: blur(12px); }
.bottom-nav button { min-height: 50px; background: transparent; color: var(--muted); font-size: 12px; }
.bottom-nav button.is-active { color: var(--brand); background: #fff0eb; font-weight: 800; }
@media (min-width: 760px) { body { margin: 16px auto; min-height: calc(100vh - 32px); } }
```

- [ ] **Step 4: 运行测试并确认通过**

Run: 使用 Task 1 的 Edge 命令。
Expected: `TEST_RESULTS: PASS 2 FAIL 0`。

- [ ] **Step 5: 检查点**

Git 可用时：

```powershell
git add index.html styles.css js/app.js tests/assert.js tests/test-runner.html tests/smoke.test.js
git commit -m "feat: scaffold static prototype and test runner"
```
---

### Task 2: 城市数据、通用工具与本地状态

**Files:**
- Modify: `tests/test-runner.html`
- Create: `tests/store.test.js`
- Create: `js/core/constants.js`
- Create: `js/core/utils.js`
- Create: `js/data/cities.js`
- Create: `js/core/store.js`

**Interfaces:**
- Consumes: `QY` 命名空间。
- Produces: `QY.CONST.STORAGE_KEY`、`QY.getCity(name)`、`QY.haversine(a, b)`、`QY.roundMoney(value)`、`QY.routeKey(origin, destination, days)`、`QY.store.read()`、`QY.store.write(state)`、`QY.store.savePlan(plan)`、`QY.store.toggleFavorite(routeId)`、`QY.store.reset()`。

- [ ] **Step 1: 添加失败测试**

创建 `tests/store.test.js`：

```javascript
QY.test('城市目录覆盖省会与热门城市', function () {
  var capitals = QY.CITIES.filter(function (city) { return city.type === 'capital'; });
  var tourist = QY.CITIES.filter(function (city) { return city.type === 'tourist'; });
  QY.assert.ok(capitals.length >= 31, '至少需要 31 个省级行政中心');
  QY.assert.ok(tourist.length >= 20, '至少需要 20 个热门旅游城市');
});

QY.test('北京到上海距离在合理区间', function () {
  var distance = QY.haversine(QY.getCity('北京'), QY.getCity('上海'));
  QY.assert.ok(distance > 1000 && distance < 1150, '距离应约为 1050 公里');
});

QY.test('路线键忽略日期但区分天数区间', function () {
  QY.assert.equal(QY.routeKey('武汉', '成都', 3), QY.routeKey('武汉', '成都', 3));
  QY.assert.ok(QY.routeKey('武汉', '成都', 3) !== QY.routeKey('武汉', '成都', 7), '不同天数区间应生成不同路线键');
});

QY.test('方案和收藏可写入本地状态', function () {
  QY.store.reset();
  QY.store.savePlan({ id: 'p1', title: '武汉到成都', routeId: 'r1' });
  QY.store.toggleFavorite('r1');
  QY.assert.equal(QY.store.read().savedPlans.length, 1);
  QY.assert.equal(QY.store.read().favorites.length, 1);
  QY.store.reset();
});
```

修改 `tests/test-runner.html`，在 `assert.js` 后加入：

```html
<script src="../js/core/constants.js"></script>
<script src="../js/core/utils.js"></script>
<script src="../js/data/cities.js"></script>
<script src="../js/core/store.js"></script>
<script src="../js/app.js"></script>
```

- [ ] **Step 2: 运行测试并确认失败**

Run: 使用计划开头的 Edge 测试命令。
Expected: 新增测试因 `QY.CITIES`、`QY.haversine` 或 `QY.store` 未定义而失败。

- [ ] **Step 3: 实现常量、工具、城市目录和存储**

创建 `js/core/constants.js`：

```javascript
(function () {
  window.QY = window.QY || {};
  window.QY.CONST = {
    STORAGE_KEY: 'qy.prototype.v1',
    PLAN_LABELS: ['极限省钱', '均衡推荐', '省时优先'],
    MODE_LABELS: { plane: '飞机', train: '火车/高铁', coach: '长途客车', rental: '租车自驾' }
  };
}());
```

创建 `js/core/utils.js`：

```javascript
(function () {
  var root = window.QY = window.QY || {};
  var R = 6371;

  function radians(value) { return value * Math.PI / 180; }

  root.haversine = function (a, b) {
    if (!a || !b) return 1000;
    var dLat = radians(b.lat - a.lat);
    var dLng = radians(b.lng - a.lng);
    var lat1 = radians(a.lat);
    var lat2 = radians(b.lat);
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return Math.round(2 * R * Math.asin(Math.sqrt(h)));
  };

  root.roundMoney = function (value) {
    return Math.max(0, Math.round(Number(value) / 10) * 10);
  };

  root.clamp = function (value, min, max) {
    return Math.min(max, Math.max(min, value));
  };

  root.routeKey = function (origin, destination, days) {
    var bucket = Number(days) <= 3 ? '1-3' : Number(days) <= 5 ? '4-5' : '6+';
    return [origin, destination, bucket].join('__');
  };
}());
```

创建 `js/data/cities.js`：

```javascript
(function () {
  var root = window.QY = window.QY || {};

  var capitals = [
    ['北京',39.9042,116.4074],['天津',39.0842,117.2009],['石家庄',38.0428,114.5149],
    ['太原',37.8706,112.5489],['呼和浩特',40.8426,111.7492],['沈阳',41.8057,123.4315],
    ['长春',43.8171,125.3235],['哈尔滨',45.8038,126.5349],['上海',31.2304,121.4737],
    ['南京',32.0603,118.7969],['杭州',30.2741,120.1551],['合肥',31.8206,117.2272],
    ['福州',26.0745,119.2965],['南昌',28.6820,115.8579],['济南',36.6512,117.1201],
    ['郑州',34.7466,113.6254],['武汉',30.5928,114.3055],['长沙',28.2282,112.9388],
    ['广州',23.1291,113.2644],['南宁',22.8170,108.3665],['海口',20.0440,110.1999],
    ['重庆',29.5630,106.5516],['成都',30.5728,104.0668],['贵阳',26.6470,106.6302],
    ['昆明',25.0389,102.7183],['拉萨',29.6520,91.1721],['西安',34.3416,108.9398],
    ['兰州',36.0611,103.8343],['西宁',36.6171,101.7782],['银川',38.4872,106.2309],
    ['乌鲁木齐',43.8256,87.6168]
  ];

  var tourist = [
    ['三亚',18.2528,109.5119,['海岛','度假'],['10','11','12','1','2','3','4']],
    ['桂林',25.2736,110.2900,['山水','摄影'],['4','5','9','10']],
    ['丽江',26.8721,100.2299,['古城','慢游'],['3','4','5','9','10','11']],
    ['大理',25.6065,100.2676,['湖景','骑行'],['3','4','5','9','10','11']],
    ['张家界',29.1171,110.4792,['登山','自然'],['4','5','9','10']],
    ['黄山',29.7147,118.3376,['登山','云海'],['3','4','5','9','10','11']],
    ['厦门',24.4798,118.0894,['海滨','文艺'],['3','4','5','10','11']],
    ['青岛',36.0671,120.3826,['海滨','啤酒'],['5','6','9','10']],
    ['大连',38.9140,121.6147,['海滨','城市'],['5','6','9','10']],
    ['威海',37.5131,122.1204,['海滨','慢游'],['5','6','9','10']],
    ['洛阳',34.6197,112.4540,['历史','古都'],['4','5','9','10']],
    ['开封',34.7972,114.3076,['历史','小吃'],['4','5','9','10']],
    ['苏州',31.2989,120.5853,['园林','城市'],['3','4','5','10','11']],
    ['无锡',31.4912,120.3119,['湖景','城市'],['3','4','5','10','11']],
    ['扬州',32.3942,119.4129,['园林','早茶'],['3','4','5','10','11']],
    ['泉州',24.8741,118.6757,['古城','人文'],['3','4','5','10','11']],
    ['珠海',22.2707,113.5767,['海滨','城市'],['3','4','10','11','12']],
    ['北海',21.4811,109.1202,['海岛','海滨'],['3','4','10','11','12']],
    ['敦煌',40.1421,94.6616,['沙漠','历史'],['5','6','9','10']],
    ['嘉峪关',39.7727,98.2896,['长城','历史'],['5','6','9','10']],
    ['西双版纳',22.0017,100.7974,['雨林','民族'],['11','12','1','2','3','4']],
    ['稻城',29.0379,100.2975,['雪山','徒步'],['5','6','9','10']],
    ['九寨沟',33.2609,103.9184,['湖泊','自然'],['4','5','9','10']],
    ['呼伦贝尔',49.2116,119.7657,['草原','自驾'],['6','7','8','9']],
    ['喀什',39.4704,75.9898,['人文','古城'],['5','6','9','10']],
    ['伊犁',43.9169,81.3242,['草原','花海'],['6','7','8','9']],
    ['平遥',37.1896,112.1764,['古城','历史'],['4','5','9','10']],
    ['婺源',29.2476,117.8618,['乡村','花海'],['3','4','11']],
    ['恩施',30.2722,109.4882,['峡谷','自然'],['4','5','9','10']],
    ['大同',40.0768,113.3001,['石窟','历史'],['5','6','9','10']]
  ];

  function makeCity(row, type) {
    return { name: row[0], lat: row[1], lng: row[2], type: type, tags: type === 'capital' ? ['城市','人文'] : row[3], bestMonths: type === 'capital' ? ['4','5','9','10'] : row[4] };
  }

  root.CITIES = capitals.map(function (row) { return makeCity(row, 'capital'); })
    .concat(tourist.map(function (row) { return makeCity(row, 'tourist'); }));

  root.getCity = function (name) {
    return root.CITIES.find(function (city) { return city.name === name; }) || null;
  };
}());
```

创建 `js/core/store.js`：

```javascript
(function () {
  var root = window.QY = window.QY || {};
  var EMPTY = { savedPlans: [], favorites: [], posts: [], interactions: {}, analytics: [] };

  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  var memory = clone(EMPTY);

  function normalize(value) {
    return Object.assign(clone(EMPTY), value || {});
  }

  root.store = {
    read: function () {
      try {
        var saved = localStorage.getItem(root.CONST.STORAGE_KEY);
        return normalize(saved ? JSON.parse(saved) : memory);
      } catch (error) {
        return normalize(memory);
      }
    },
    write: function (state) {
      var next = normalize(state);
      memory = clone(next);
      try { localStorage.setItem(root.CONST.STORAGE_KEY, JSON.stringify(next)); } catch (error) { void error; }
      return next;
    },
    savePlan: function (plan) {
      var state = root.store.read();
      state.savedPlans = state.savedPlans.filter(function (item) { return item.id !== plan.id; });
      state.savedPlans.unshift(clone(plan));
      return root.store.write(state);
    },
    toggleFavorite: function (routeId) {
      var state = root.store.read();
      var index = state.favorites.indexOf(routeId);
      if (index === -1) state.favorites.push(routeId);
      else state.favorites.splice(index, 1);
      return root.store.write(state);
    },
    reset: function () {
      memory = clone(EMPTY);
      try { localStorage.removeItem(root.CONST.STORAGE_KEY); } catch (error) { void error; }
      return clone(EMPTY);
    }
  };
}());
```

- [ ] **Step 4: 运行测试并确认通过**

Run: 使用计划开头的 Edge 测试命令。
Expected: 所有已注册测试通过，`FAIL 0`。

- [ ] **Step 5: 检查点**

```powershell
git add tests/test-runner.html tests/store.test.js js/core/constants.js js/core/utils.js js/data/cities.js js/core/store.js
git commit -m "feat: add city catalog and local state"
```
---

### Task 3: 路线校验、途径点与三套方案生成

**Files:**
- Modify: `tests/test-runner.html`
- Create: `tests/planner.test.js`
- Create: `js/core/planner.js`

**Interfaces:**
- Consumes: `QY.getCity(name)`、`QY.haversine(a,b)`、`QY.roundMoney(value)`、`QY.CONST.PLAN_LABELS`。
- Produces: `QY.validatePlanInput(input)`、`QY.estimateLeg(fromName,toName,mode,travellers)`、`QY.generatePlans(input)`。每套方案结构为 `{id,strategy,label,totalCost:{min,normal},budgetBalance,totalHours,transfers,latestArrival,route,segments,costs,daily,dataSource}`。

- [ ] **Step 1: 写失败测试**

创建 `tests/planner.test.js`：

```javascript
QY.test('路线输入缺少必填项时返回明确错误', function () {
  var result = QY.validatePlanInput({});
  QY.assert.ok(result.errors.indexOf('请选择出发地') >= 0, '应提示出发地');
  QY.assert.ok(result.errors.indexOf('请选择目的地') >= 0, '应提示目的地');
  QY.assert.ok(result.errors.indexOf('请至少选择一种交通方式') >= 0, '应提示交通方式');
});

QY.test('途径点不超过三个且不能重复', function () {
  var result = QY.validatePlanInput({
    budget: 3000, travellers: 2, companionType: 'friends', origin: '武汉',
    destination: '成都', waypoints: ['重庆', '重庆', '西安', '兰州'],
    startDate: '2026-10-01', days: 7, modes: ['train']
  });
  QY.assert.ok(result.errors.indexOf('途径点最多 3 个') >= 0, '应限制三个途径点');
  QY.assert.ok(result.errors.indexOf('途径点不能重复') >= 0, '应阻止重复途径点');
});

QY.test('固定输入稳定生成三套有差异的方案', function () {
  var plans = QY.generatePlans({
    budget: 4000, travellers: 2, companionType: 'friends', origin: '武汉',
    destination: '成都', waypoints: ['重庆'], startDate: '2026-10-01', days: 7,
    modes: ['plane', 'train', 'coach', 'rental'], priority: 'balanced'
  });
  QY.assert.deepEqual(plans.map(function (plan) { return plan.label; }), ['极限省钱', '均衡推荐', '省时优先']);
  QY.assert.ok(plans[0].totalCost.normal <= plans[1].totalCost.normal, '省钱方案不应比均衡方案更贵');
  QY.assert.ok(plans[1].totalCost.normal <= plans[2].totalCost.normal, '均衡方案不应比省时方案更贵');
  QY.assert.deepEqual(plans[1].route, ['武汉', '重庆', '成都']);
  QY.assert.equal(plans[1].segments.length, 2);
  QY.assert.equal(plans[1].dataSource, '模拟预估');
});
```

修改 `tests/test-runner.html`，在 `store.js` 后加入：

```html
<script src="../js/core/planner.js"></script>
```

- [ ] **Step 2: 运行测试并确认失败**

Run: 使用计划开头的 Edge 测试命令。
Expected: 计划测试因 `QY.validatePlanInput` 或 `QY.generatePlans` 未定义而失败。

- [ ] **Step 3: 实现路线核心**

创建 `js/core/planner.js`：

```javascript
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
      budgetBalance: root.roundMoney(Number(input.budget) - normal),
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
```

- [ ] **Step 4: 运行测试并确认通过**

Run: 使用计划开头的 Edge 测试命令。
Expected: `FAIL 0`，三套方案测试通过。

- [ ] **Step 5: 检查点**

```powershell
git add tests/test-runner.html tests/planner.test.js js/core/planner.js
git commit -m "feat: add route planner with waypoints"
```
---

### Task 4: “下一站，未知”推荐引擎

**Files:**
- Modify: `tests/test-runner.html`
- Create: `tests/recommender.test.js`
- Create: `js/core/recommender.js`

**Interfaces:**
- Consumes: `QY.CITIES`、`QY.generatePlans(input)`、`QY.clamp(value,min,max)`。
- Produces: `QY.recommendDestinations(input, sortMode)`、`QY.surpriseDestinations(input, excludedCity)`。推荐项结构为 `{city,totalCost,hours,transfers,seasonal,score,reason}`。

- [ ] **Step 1: 写失败测试**

创建 `tests/recommender.test.js`：

```javascript
function recommendationInput() {
  return {
    origin: '武汉', days: 5, budget: 3000, month: '10',
    companionType: 'friends', interests: ['古城', '人文'],
    startDate: '2026-10-01'
  };
}

QY.test('推荐结果包含费用、时间与可读理由', function () {
  var results = QY.recommendDestinations(recommendationInput(), 'balanced');
  QY.assert.ok(results.length >= 3, '应返回至少三个候选目的地');
  QY.assert.ok(results[0].totalCost > 0, '应包含预计费用');
  QY.assert.ok(results[0].hours > 0, '应包含预计耗时');
  QY.assert.ok(results[0].reason.indexOf('人均约') >= 0, '理由应包含预计人均费用');
});

QY.test('花费最低排序按费用升序', function () {
  var results = QY.recommendDestinations(recommendationInput(), 'lowestCost');
  QY.assert.ok(results[0].totalCost <= results[1].totalCost, '第一条应不贵于第二条');
  QY.assert.ok(results[1].totalCost <= results[2].totalCost, '第二条应不贵于第三条');
});

QY.test('季节最合适排序优先当季城市', function () {
  var results = QY.recommendDestinations(recommendationInput(), 'bestSeason');
  QY.assert.equal(results[0].seasonal, 1);
});

QY.test('惊喜推荐排除刚刚看过的目的地', function () {
  var first = QY.surpriseDestinations(recommendationInput(), null);
  var next = QY.surpriseDestinations(recommendationInput(), first.main.city.name);
  QY.assert.ok(next.main.city.name !== first.main.city.name, '换一个后不应重复主推荐');
  QY.assert.equal(next.alternatives.length, 2);
});
```

修改 `tests/test-runner.html`，在 `planner.js` 后加入：

```html
<script src="../js/core/recommender.js"></script>
```

- [ ] **Step 2: 运行测试并确认失败**

Run: 使用计划开头的 Edge 测试命令。
Expected: 推荐测试因 `QY.recommendDestinations` 未定义而失败。

- [ ] **Step 3: 实现推荐引擎**

创建 `js/core/recommender.js`：

```javascript
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
```

- [ ] **Step 4: 运行测试并确认通过**

Run: 使用计划开头的 Edge 测试命令。
Expected: `FAIL 0`。排名测试稳定，因为同分排序包含城市原始顺序作为最终决定。

- [ ] **Step 5: 检查点**

```powershell
git add tests/test-runner.html tests/recommender.test.js js/core/recommender.js
git commit -m "feat: add surprise destination recommender"
```
---

### Task 5: 热门路线数据、旅人现场与模拟互动

**Files:**
- Create: `tests/community.test.js`
- Create: `js/data/routes.js`
- Create: `js/data/community.js`
- Create: `js/core/community.js`
- Modify: `tests/test-runner.html`

**Interfaces:**
- Consumes: `QY.CITIES`、`QY.routeKey(origin,destination,days)`、`QY.store`。
- Produces: `QY.HOT_ROUTES`、`QY.getHotRoute(id)`、`QY.listPosts()`、`QY.groupPosts(posts)`、`QY.createPost(data)`、`QY.addComment(postId,text)`、`QY.toggleLike(postId)`。

- [ ] **Step 1: 写失败测试**

创建 `tests/community.test.js`：

```javascript
QY.test('热门路线都包含合法途径点', function () {
  QY.assert.ok(QY.HOT_ROUTES.length >= 8, '至少需要 8 条热门路线');
  QY.HOT_ROUTES.forEach(function (route) {
    QY.assert.ok(route.waypoints.length >= 1 && route.waypoints.length <= 3, route.id + ' 应包含 1 到 3 个途径点');
    QY.assert.ok(QY.getCity(route.origin), route.origin + ' 应存在于城市目录');
    QY.assert.ok(QY.getCity(route.destination), route.destination + ' 应存在于城市目录');
    route.waypoints.forEach(function (name) {
      QY.assert.ok(QY.getCity(name), name + ' 应存在于城市目录');
    });
  });
});

QY.test('相同路线与天数区间会聚合到同一主题', function () {
  var groups = QY.groupPosts(QY.listPosts());
  var target = groups.find(function (group) { return group.key === QY.routeKey('武汉', '成都', 5); });
  QY.assert.ok(target, '应存在武汉到成都的路线主题');
  QY.assert.ok(target.posts.length >= 2, '同路线经验应聚合在一起');
});

QY.test('发布帖子并模拟点赞与评论', function () {
  QY.store.reset();
  var post = QY.createPost({
    origin: '武汉', destination: '成都', days: 5,
    title: '夜车省钱实测', content: '总花费 980 元，重庆中转最便宜。', cost: 980
  });
  QY.addComment(post.id, '请问返程也是夜车吗？');
  QY.toggleLike(post.id);
  var saved = QY.listPosts().find(function (item) { return item.id === post.id; });
  QY.assert.equal(saved.comments.length, 1);
  QY.assert.equal(saved.likes, 1);
  QY.assert.equal(saved.liked, true);
  QY.store.reset();
});
```

修改 `tests/test-runner.html`，按以下顺序加入：

```html
<script src="../js/data/routes.js"></script>
<script src="../js/data/community.js"></script>
<script src="../js/core/community.js"></script>
```

- [ ] **Step 2: 运行测试并确认失败**

Run: 使用计划开头的 Edge 测试命令。
Expected: 社区测试因 `QY.HOT_ROUTES` 或 `QY.groupPosts` 未定义而失败。

- [ ] **Step 3: 实现热门路线与社区核心**

创建 `js/data/routes.js`：

```javascript
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
  window.QY.getHotRoute = function (id) {
    return window.QY.HOT_ROUTES.find(function (route) { return route.id === id; }) || null;
  };
}());
```

在 `js/data/cities.js` 中补充 `格尔木` 和 `康定`，使用以下行：

```javascript
['格尔木',36.4064,94.9285,['高原','中转'],['5','6','7','8','9']],
['康定',30.0417,101.9638,['川西','高原'],['5','6','7','8','9','10']]
```

创建 `js/data/community.js`：

```javascript
(function () {
  window.QY = window.QY || {};
  window.QY.SEED_POSTS = [
    {
      id:'seed-wc-1', origin:'武汉', destination:'成都', days:5, cost:980, author:'夜行列车',
      title:'学生党 980 元走完武汉到成都', content:'重庆转长途客车最便宜，但比火车多花 5 小时。住在春熙路外侧的青旅，步行到地铁很近。',
      likes:42, liked:false, comments:[{ id:'c1', author:'背包小周', text:'请问凌晨到重庆安全吗？' }]
    },
    {
      id:'seed-wc-2', origin:'武汉', destination:'成都', days:5, cost:1260, author:'青旅常客',
      title:'多花 280 元换少两次换乘', content:'如果不想坐夜车，建议高铁直达重庆后再换动车。贵一些，但整天精神状态完全不同。',
      likes:31, liked:false, comments:[{ id:'c2', author:'慢慢走', text:'这个方案适合第一次独自出门。' }]
    },
    {
      id:'seed-xd-1', origin:'西安', destination:'敦煌', days:8, cost:1680, author:'河西走廊',
      title:'兰州住一晚，白天看黄河', content:'西安到兰州坐夜车，白天在兰州停留再继续向西。总费用不高，但需要提前订青旅。',
      likes:57, liked:false, comments:[]
    },
    {
      id:'seed-kl-1', origin:'昆明', destination:'丽江', days:7, cost:1450, author:'云南慢游',
      title:'大理两天，丽江三天最舒服', content:'大巴比火车灵活，沿途能停服务区。住宿不要只盯古城中心，步行十五分钟外便宜很多。',
      likes:68, liked:false, comments:[{ id:'c3', author:'风花雪月', text:'旺季要提前多久订房？' }]
    }
  ];
}());
```

创建 `js/core/community.js`：

```javascript
(function () {
  var root = window.QY = window.QY || {};

  function clone(value) { return JSON.parse(JSON.stringify(value)); }

  function ensurePosts() {
    var state = root.store.read();
    if (!state.posts.length) {
      state.posts = clone(root.SEED_POSTS);
      root.store.write(state);
    }
    return root.store.read();
  }

  root.listPosts = function () {
    return ensurePosts().posts.slice().sort(function (a, b) { return b.likes - a.likes; });
  };

  root.groupPosts = function (posts) {
    var map = {};
    posts.forEach(function (post) {
      var key = root.routeKey(post.origin, post.destination, post.days);
      if (!map[key]) map[key] = { key:key, title:post.origin + ' → ' + post.destination, posts:[] };
      map[key].posts.push(post);
    });
    return Object.keys(map).map(function (key) { return map[key]; });
  };

  root.createPost = function (data) {
    var state = ensurePosts();
    var post = {
      id:'user-' + Date.now(), origin:data.origin, destination:data.destination, days:Number(data.days),
      cost:Number(data.cost) || 0, author:'我', title:String(data.title).trim(),
      content:String(data.content).trim(), likes:0, liked:false, comments:[]
    };
    state.posts.unshift(post);
    root.store.write(state);
    return post;
  };

  root.addComment = function (postId, text) {
    var state = ensurePosts();
    var post = state.posts.find(function (item) { return item.id === postId; });
    if (!post || !String(text).trim()) return null;
    var comment = { id:'comment-' + Date.now(), author:'我', text:String(text).trim() };
    post.comments.push(comment);
    root.store.write(state);
    return comment;
  };

  root.toggleLike = function (postId) {
    var state = ensurePosts();
    var post = state.posts.find(function (item) { return item.id === postId; });
    if (!post) return null;
    post.liked = !post.liked;
    post.likes = Math.max(0, post.likes + (post.liked ? 1 : -1));
    root.store.write(state);
    return post;
  };
}());
```

- [ ] **Step 4: 运行测试并确认通过**

Run: 使用计划开头的 Edge 测试命令。
Expected: `FAIL 0`，社区聚合和互动测试通过。

- [ ] **Step 5: 检查点**

```powershell
git add tests/test-runner.html tests/community.test.js js/data/routes.js js/data/community.js js/core/community.js js/data/cities.js
git commit -m "feat: add route community and mock interactions"
```
---

### Task 6: 首页规划表单与三套方案界面

**Files:**
- Modify: `index.html`
- Modify: `tests/test-runner.html`
- Modify: `js/core/utils.js`
- Create: `js/ui/home.js`
- Create: `js/ui/plans.js`
- Create: `tests/ui.test.js`
- Modify: `styles.css`

**Interfaces:**
- Consumes: `QY.CITIES`、`QY.validatePlanInput(input)`、`QY.generatePlans(input)`、`QY.store.savePlan(plan)`、`QY.navigate(viewName)`。
- Produces: `QY.escapeHtml(value)`、`QY.collectPlanInput(form)`、`QY.renderHome()`、`QY.renderPlans(plans,input)`、`QY.showPlans(input)`。

- [ ] **Step 1: 写失败界面测试**

创建 `tests/ui.test.js`：

```javascript
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
```

修改 `tests/test-runner.html`，在 `app.js` 之前加入：

```html
<script src="../js/ui/home.js"></script>
<script src="../js/ui/plans.js"></script>
```

在现有测试脚本区加入：

```html
<script src="../tests/ui.test.js"></script>
```

- [ ] **Step 2: 运行测试并确认失败**

Run: 使用计划开头的 Edge 测试命令。
Expected: 界面测试因 `QY.renderHome` 或 `QY.renderPlans` 未定义而失败。

- [ ] **Step 3: 实现首页和方案视图**

在 `index.html` 的 `#view-community` 前加入：

```html
<section id="view-plans" class="view" aria-label="方案比较"></section>
```

在 `js/core/utils.js` 的 `routeKey` 前加入：

```javascript
root.escapeHtml = function (value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
    return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char];
  });
};
```

创建 `js/ui/home.js`：

```javascript
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
    root.renderPlans(root.generatePlans(input), input);
    root.navigate('plans');
    return true;
  };

  root.renderHome = function () {
    var view = document.getElementById('view-home');
    if (!view) return;
    view.innerHTML = [
      '<section class="hero-card">',
      '<p class="eyebrow">预算有限，也能去很远</p>',
      '<h1>把假期、预算和出发地交给我们</h1>',
      '<p>一分钟生成三套能直接比较的穷游方案。</p>',
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
  };
}());
```

创建 `js/ui/plans.js`：

```javascript
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
      '<button type="button" class="secondary-button" data-save-plan="' + plan.id + '">保存这套方案</button>',
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
        button.textContent = '已保存';
        button.disabled = true;
      });
    });
  };
}());
```

在 `styles.css` 中追加：

```css
.hero-card { padding: 28px 22px; border-radius: 28px; color: #fff; background: linear-gradient(135deg, #ff5a36, #ff8c42); box-shadow: var(--shadow); }
.hero-card h1 { margin: 8px 0; font-size: 32px; line-height: 1.15; }
.hero-card p { margin: 0; color: rgba(255,255,255,.88); }
.eyebrow { margin: 0 0 8px; color: var(--brand); font-size: 13px; font-weight: 800; letter-spacing: .08em; }
.planner-card, .plan-card, .panel { margin-top: 18px; padding: 18px; border: 1px solid var(--line); border-radius: 24px; background: var(--card); box-shadow: var(--shadow); }
.field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.field-grid label { display: grid; gap: 6px; color: var(--muted); font-size: 13px; }
.field-grid input, .field-grid select, .waypoint-row input { width: 100%; min-height: 48px; padding: 10px 12px; border: 1px solid var(--line); border-radius: 14px; background: #fafbf8; color: var(--ink); }
fieldset { margin: 18px 0 0; padding: 0; border: 0; }
legend { margin-bottom: 8px; font-weight: 800; }
.choice-row { display: flex; flex-wrap: wrap; gap: 8px; }
.choice-row label { display: flex; align-items: center; gap: 6px; min-height: 44px; padding: 0 12px; border: 1px solid var(--line); border-radius: 14px; background: #fafbf8; }
.waypoint-box { margin-top: 18px; padding: 16px; border-radius: 18px; background: #f7f8f4; }
.waypoint-box > div:first-child { display: flex; justify-content: space-between; gap: 10px; }
.waypoint-box p { margin: 4px 0 12px; color: var(--muted); font-size: 13px; }
.waypoint-box button, .secondary-button, .text-button { padding: 10px 14px; color: var(--brand-dark); background: #fff0eb; }
.waypoint-row { display: grid; grid-template-columns: 1fr auto; gap: 8px; margin-top: 8px; }
.primary-button { width: 100%; margin-top: 18px; color: #fff; background: var(--brand); font-size: 17px; font-weight: 900; box-shadow: 0 10px 24px rgba(255,90,54,.32); }
.form-error { min-height: 22px; margin: 12px 0 0; color: #b42318; font-size: 13px; }
.section-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.plan-list { display: grid; gap: 14px; }
.plan-head, .metric-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.plan-head > span { color: var(--brand); font-weight: 900; }
.plan-price { display: block; margin-top: 12px; font-size: 36px; }
.metric-row { margin: 14px 0; color: var(--muted); font-size: 13px; }
.route-chain { padding: 12px; border-radius: 14px; background: #f7f8f4; font-weight: 700; }
.table-scroll { overflow-x: auto; }
.compare-table { min-width: 620px; border-collapse: collapse; background: #fff; }
.compare-table th, .compare-table td { padding: 12px; border-bottom: 1px solid var(--line); text-align: left; }
.data-source { color: var(--muted); }
@media (max-width: 380px) { .field-grid { grid-template-columns: 1fr; } }
```

- [ ] **Step 4: 运行测试并确认通过**

Run: 使用计划开头的 Edge 测试命令。
Expected: `FAIL 0`，界面测试通过。

- [ ] **Step 5: 手动验收**

使用 Edge 打开 `index.html`，确认首页首屏能看到表单、主按钮和三个交通方式选项；提交后出现三张方案卡与横向比较表。

- [ ] **Step 6: 检查点**

```powershell
git add index.html styles.css js/core/utils.js js/ui/home.js js/ui/plans.js tests/test-runner.html tests/ui.test.js
git commit -m "feat: add direct home planner and plan comparison"
```
---

### Task 7: “下一站，未知”惊喜推荐界面

**Files:**
- Modify: `tests/test-runner.html`
- Modify: `js/ui/home.js`
- Create: `js/ui/next.js`
- Create: `tests/next-ui.test.js`
- Modify: `styles.css`

**Interfaces:**
- Consumes: `QY.recommendDestinations(input,sortMode)`、`QY.getCity(name)`、`QY.navigate(viewName)`、`QY.renderHome()`。
- Produces: `QY.renderNextTeaser()`、`QY.renderNextPage()`、`QY.renderSurprise(result)`、`QY.prefillPlan(input)`。

- [ ] **Step 1: 写失败测试**

创建 `tests/next-ui.test.js`：

```javascript
QY.test('下一站页面包含四个排序按钮和筛选表单', function () {
  document.body.innerHTML = '<section id="view-home"></section><section id="view-next"></section>';
  QY.renderNextPage();
  QY.assert.ok(document.body.textContent.indexOf('下一站，未知') >= 0, '应显示模块标题');
  QY.assert.equal(document.querySelectorAll('[data-sort]').length, 4, '应有四个排序按钮');
  QY.assert.ok(document.querySelector('#surprise-form'), '应显示惊喜筛选表单');
});

QY.test('揭晓界面包含主推荐和两个备选', function () {
  document.body.innerHTML = '<div id="surprise-result" data-excluded=""></div>';
  var input = { origin:'武汉', days:5, budget:3000, month:'10', companionType:'friends', interests:['古城'], startDate:'2026-10-01' };
  var results = QY.recommendDestinations(input, 'balanced');
  QY.renderSurprise({ main:results[0], alternatives:results.slice(1,3) });
  QY.assert.ok(document.querySelector('.surprise-main'), '应渲染主推荐');
  QY.assert.equal(document.querySelectorAll('.surprise-alt').length, 2, '应渲染两个备选');
});

QY.test('就它了可以把推荐目的地带回首页表单', function () {
  document.body.innerHTML = '<section id="view-home"></section><section id="view-next"></section>';
  QY.renderHome();
  QY.prefillPlan({ origin:'武汉', destination:'丽江', days:5, budget:2600 });
  QY.assert.equal(document.querySelector('[name="destination"]').value, '丽江');
  QY.assert.equal(document.querySelector('[name="days"]').value, '5');
});
```

修改 `tests/test-runner.html`，在 `plans.js` 后加入：

```html
<script src="../js/ui/next.js"></script>
```

加入测试脚本：

```html
<script src="../tests/next-ui.test.js"></script>
```

- [ ] **Step 2: 运行测试并确认失败**

Run: 使用计划开头的 Edge 测试命令。
Expected: 新测试因 `QY.renderNextPage` 或 `QY.renderSurprise` 未定义而失败。

- [ ] **Step 3: 实现惊喜推荐界面**

修改 `js/ui/home.js` 的 `renderHome`，在给表单绑定事件后加入：

```javascript
    var teaser = document.createElement('div');
    teaser.id = 'next-teaser';
    view.appendChild(teaser);
    if (root.renderNextTeaser) root.renderNextTeaser();
```

创建 `js/ui/next.js`：

```javascript
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
      '<p class="eyebrow">' + (className === 'surprise-main' ? '这次去这里' : '备选目的地') + '</p>',
      '<h2>' + root.escapeHtml(item.city.name) + '</h2>',
      '<p>' + root.escapeHtml(item.reason) + '</p>',
      '<div class="metric-row"><span>人均约 ¥' + Number(item.totalCost).toLocaleString('zh-CN') + '</span><span>' + item.hours + ' 小时</span><span>' + item.transfers + ' 次换乘</span></div>',
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
    form.querySelector('.form-error').textContent = '目的地已带入，点击下方按钮生成三套方案。';
  };

  function runSurprise() {
    var input = collect();
    var error = document.getElementById('surprise-error');
    if (!root.getCity(input.origin)) {
      error.textContent = '请输入城市目录中的出发城市';
      return;
    }
    error.textContent = '';
    var result = { main:null, alternatives:[] };
    var excluded = document.getElementById('surprise-result').getAttribute('data-excluded');
    var activeSort = document.querySelector('[data-sort].is-active');
    var sortMode = activeSort ? activeSort.getAttribute('data-sort') : 'balanced';
    var items = root.recommendDestinations(input, sortMode).filter(function (item) { return item.city.name !== excluded; });
    result.main = items[0];
    result.alternatives = items.slice(1, 3);
    document.getElementById('surprise-result').setAttribute('data-excluded', result.main.city.name);
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
    teaser.querySelector('[data-open-next]').addEventListener('click', function () { root.navigate('next'); });
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
        view.setAttribute('data-sort-mode', button.getAttribute('data-sort'));
      });
    });
    view.querySelector('#surprise-button').addEventListener('click', runSurprise);
  };
}());
```

在 `styles.css` 中追加：

```css
.next-invite { color: #fff; background: radial-gradient(circle at 80% 20%, #f7c948 0 10%, transparent 11%), linear-gradient(145deg, #17211b, #294435); }
.next-invite .eyebrow, .next-invite p { color: rgba(255,255,255,.84); }
.next-invite h2 { font-size: 28px; line-height: 1.2; }
.next-hero { background: linear-gradient(145deg, #17211b, #33513e); }
.sort-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 18px; }
.sort-row button { padding: 10px; border: 1px solid var(--line); background: #fff; color: var(--muted); }
.sort-row button.is-active { border-color: var(--brand); color: var(--brand); background: #fff0eb; font-weight: 800; }
.surprise-main, .surprise-alt { margin-top: 16px; padding: 20px; border-radius: 24px; background: #fff; box-shadow: var(--shadow); }
.surprise-main { border: 2px solid var(--brand); background: linear-gradient(160deg, #fff, #fff4e8); }
.surprise-main h2, .surprise-alt h2 { margin: 4px 0 10px; font-size: 34px; }
.surprise-alt { display: inline-block; width: calc(50% - 5px); vertical-align: top; }
.tag-row { display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0; }
.tag-row span { padding: 5px 9px; border-radius: 999px; background: #f1f5ef; color: var(--muted); font-size: 12px; }
```

- [ ] **Step 4: 运行测试并确认通过**

Run: 使用计划开头的 Edge 测试命令。
Expected: `FAIL 0`，惊喜推荐界面测试通过。

- [ ] **Step 5: 手动验收**

打开首页点击“给我一个惊喜”，进入完整推荐页；点击“给我一个惊喜”后出现一个主推荐和两个备选；点击“就它了”后回到首页并带入目的地、天数和预算。

- [ ] **Step 6: 检查点**

```powershell
git add styles.css js/ui/home.js js/ui/next.js tests/test-runner.html tests/next-ui.test.js
git commit -m "feat: add surprise destination experience"
```
---

### Task 8: 热门路线与途径点详情

**Files:**
- Modify: `index.html`
- Modify: `tests/test-runner.html`
- Modify: `js/ui/home.js`
- Modify: `js/ui/next.js`
- Create: `js/ui/routes.js`
- Create: `tests/routes-ui.test.js`
- Modify: `styles.css`

**Interfaces:**
- Consumes: `QY.HOT_ROUTES`、`QY.getHotRoute(id)`、`QY.estimateLeg(from,to,mode,travellers)`、`QY.prefillPlan(input)`。
- Produces: `QY.routeInputFromHotRoute(route)`、`QY.renderHotRoutes()`、`QY.renderRouteDetail(routeId)`。

- [ ] **Step 1: 写失败测试**

创建 `tests/routes-ui.test.js`：

```javascript
QY.test('热门路线模块展示完整路线和途径点', function () {
  document.body.innerHTML = '<section id="view-home"></section><section id="view-route"></section>';
  QY.renderHotRoutes();
  QY.assert.ok(document.querySelectorAll('.hot-route-card').length >= 8, '应展示热门路线卡片');
  QY.assert.ok(document.body.textContent.indexOf('武汉 → 重庆 → 成都') >= 0, '应展示途径点路线链');
});

QY.test('热门路线详情按分段显示交通', function () {
  document.body.innerHTML = '<section id="view-home"></section><section id="view-route"></section>';
  QY.renderRouteDetail('wuhan-chengdu');
  QY.assert.equal(document.querySelectorAll('.route-segment').length, 2, '武汉到成都加一个途径点应有两段');
  QY.assert.ok(document.body.textContent.indexOf('武汉 → 重庆') >= 0, '应显示第一段');
  QY.assert.ok(document.body.textContent.indexOf('重庆 → 成都') >= 0, '应显示第二段');
});

QY.test('热门路线可转换为规划输入', function () {
  var input = QY.routeInputFromHotRoute(QY.getHotRoute('beijing-xian'));
  QY.assert.deepEqual(input.waypoints, ['大同', '平遥']);
  QY.assert.equal(input.destination, '西安');
  QY.assert.equal(input.days, 9);
});
```

修改 `tests/test-runner.html`，在 `next.js` 后加入：

```html
<script src="../js/ui/routes.js"></script>
```

加入测试脚本：

```html
<script src="../tests/routes-ui.test.js"></script>
```

- [ ] **Step 2: 运行测试并确认失败**

Run: 使用计划开头的 Edge 测试命令。
Expected: 新测试因 `QY.renderHotRoutes` 未定义而失败。

- [ ] **Step 3: 实现热门路线界面和带入逻辑**

在 `index.html` 的 `#view-plans` 后加入：

```html
<section id="view-route" class="view" aria-label="热门路线详情"></section>
```

并在 `js/ui/next.js` 的脚本标签后加入：

```html
<script src="js/ui/routes.js"></script>
```

修改 `js/ui/home.js` 的 `renderHome`，在调用 `renderNextTeaser` 后加入：

```javascript
    if (root.renderHotRoutes) root.renderHotRoutes();
```

创建 `js/ui/routes.js`：

```javascript
(function () {
  var root = window.QY = window.QY || {};

  root.routeInputFromHotRoute = function (route) {
    return {
      budget: route.budget,
      travellers: 2,
      companionType: 'friends',
      origin: route.origin,
      destination: route.destination,
      waypoints: route.waypoints.slice(),
      startDate: '2026-10-01',
      days: route.days,
      modes: route.modes.slice(),
      priority: 'balanced'
    };
  };

  function routeChain(route, arrow) {
    return [route.origin].concat(route.waypoints).concat(route.destination).join(arrow || ' → ');
  }

  root.renderHotRoutes = function () {
    var view = document.getElementById('view-home');
    if (!view) return;
    var section = document.createElement('section');
    section.id = 'hot-routes';
    section.className = 'content-section';
    section.innerHTML = '<div class="section-head"><div><p class="eyebrow">热门路线</p><h2>已经有人替你走通过</h2></div></div><div class="horizontal-list">' +
      root.HOT_ROUTES.map(function (route) {
        return '<article class="hot-route-card"><div class="route-cover">' + root.escapeHtml(route.origin) + ' → ' + root.escapeHtml(route.destination) + '</div><h3>' + root.escapeHtml(route.title) + '</h3><p>' + root.escapeHtml(routeChain(route)) + '</p><div class="metric-row"><span>' + route.days + ' 天</span><span>¥' + Number(route.budget).toLocaleString('zh-CN') + '</span><span>' + route.modes.length + ' 种交通</span></div><button type="button" class="secondary-button" data-route-id="' + route.id + '">查看途径点</button></article>';
      }).join('') + '</div>';
    view.appendChild(section);
    section.querySelectorAll('[data-route-id]').forEach(function (button) {
      button.addEventListener('click', function () { root.renderRouteDetail(button.getAttribute('data-route-id')); });
    });
  };

  root.renderRouteDetail = function (routeId) {
    var route = root.getHotRoute(routeId);
    var view = document.getElementById('view-route');
    if (!route || !view) return;
    var points = [route.origin].concat(route.waypoints).concat(route.destination);
    var segments = [];
    for (var index = 0; index < points.length - 1; index += 1) {
      var options = route.modes.map(function (mode) { return root.estimateLeg(points[index], points[index + 1], mode, 2); });
      var cheapest = options.slice().sort(function (a, b) { return a.cost - b.cost; })[0];
      segments.push('<article class="route-segment"><div><strong>' + root.escapeHtml(points[index]) + ' → ' + root.escapeHtml(points[index + 1]) + '</strong><p>约 ' + cheapest.km + ' 公里，最低模拟费用 ¥' + cheapest.cost + '，约 ' + cheapest.hours + ' 小时</p></div><span>' + options.map(function (item) { return item.modeLabel + ' ¥' + item.cost; }).join(' · ') + '</span></article>');
    }
    view.innerHTML = [
      '<button type="button" class="text-button" data-back-home>返回首页</button>',
      '<section class="hero-card route-hero"><p class="eyebrow">热门路线</p><h1>' + root.escapeHtml(route.title) + '</h1><p>' + root.escapeHtml(routeChain(route)) + '</p><div class="metric-row"><span>' + route.days + ' 天</span><span>建议预算 ¥' + Number(route.budget).toLocaleString('zh-CN') + '</span></div></section>',
      '<section class="panel"><h2>途径点行程线</h2><div class="route-timeline">' + segments.join('') + '</div><p class="data-source">以上均为模拟预估，接入实时数据前不会显示真实班次。</p><button type="button" class="primary-button" data-use-route>一键带入我的规划</button></section>'
    ].join('');
    view.querySelector('[data-back-home]').addEventListener('click', function () { root.navigate('home'); });
    view.querySelector('[data-use-route]').addEventListener('click', function () { root.prefillPlan(root.routeInputFromHotRoute(route)); });
    root.navigate('route');
  };
}());
```

修改 `js/ui/next.js` 的 `prefillPlan`，在设置目的地后加入：

```javascript
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
```

在 `styles.css` 中追加：

```css
.content-section { margin-top: 28px; }
.horizontal-list { display: grid; grid-auto-flow: column; grid-auto-columns: 84%; gap: 12px; overflow-x: auto; padding: 2px 2px 14px; scroll-snap-type: x mandatory; }
.hot-route-card { scroll-snap-align: start; padding: 14px; border: 1px solid var(--line); border-radius: 22px; background: #fff; box-shadow: var(--shadow); }
.route-cover { display: flex; align-items: flex-end; min-height: 118px; padding: 14px; border-radius: 16px; color: #fff; background: linear-gradient(135deg, #294435, #ff8c42); font-size: 20px; font-weight: 900; }
.hot-route-card h3 { margin: 14px 0 6px; }
.hot-route-card p { color: var(--muted); }
.route-hero { background: linear-gradient(145deg, #294435, #17211b); }
.route-timeline { display: grid; gap: 10px; }
.route-segment { display: flex; justify-content: space-between; gap: 12px; padding: 14px; border-left: 4px solid var(--brand); border-radius: 14px; background: #f7f8f4; }
.route-segment p { margin: 4px 0 0; color: var(--muted); }
.route-segment > span { color: var(--brand-dark); font-size: 12px; text-align: right; }
```

- [ ] **Step 4: 运行测试并确认通过**

Run: 使用计划开头的 Edge 测试命令。
Expected: `FAIL 0`，热门路线和途径点测试通过。

- [ ] **Step 5: 手动验收**

在首页热门路线中打开“从江城吃到天府”，确认显示“武汉 → 重庆 → 成都”和两段交通；点击“一键带入我的规划”，确认首页表单出现重庆途径点。

- [ ] **Step 6: 检查点**

```powershell
git add index.html styles.css js/ui/home.js js/ui/next.js js/ui/routes.js tests/test-runner.html tests/routes-ui.test.js
git commit -m "feat: add hot routes with waypoint details"
```
---

### Task 8A: 本地风景图片与视觉升级

**Files:**
- Create: `assets/images/hero-journey.svg`
- Create: `assets/images/route-city.svg`
- Create: `assets/images/route-coast.svg`
- Create: `assets/images/route-garden.svg`
- Create: `assets/images/route-mountain.svg`
- Create: `assets/images/route-grassland.svg`
- Create: `assets/images/route-desert.svg`
- Create: `assets/images/route-plateau.svg`
- Create: `assets/images/route-old-town.svg`
- Create: `js/core/visuals.js`
- Modify: `js/data/routes.js`
- Modify: `js/ui/home.js`
- Modify: `js/ui/next.js`
- Modify: `js/ui/routes.js`
- Modify: `tests/ui.test.js`
- Modify: `tests/next-ui.test.js`
- Modify: `tests/routes-ui.test.js`
- Modify: `tests/test-runner.html`
- Modify: `styles.css`

**Interfaces:**
- Consumes: `QY.HOT_ROUTES`、`QY.CITIES`。
- Produces: `QY.VISUALS`、`QY.imageForCity(cityName)`、`QY.imageForRoute(route)`。

- [ ] **Step 1: 写失败测试**

在 `tests/routes-ui.test.js` 中加入：

```javascript
QY.test('热门路线卡使用本地风景图', function () {
  document.body.innerHTML = '<section id="view-home"></section><section id="view-route"></section>';
  QY.renderHotRoutes();
  var first = document.querySelector('.route-cover');
  QY.assert.ok(first.getAttribute('style').indexOf('assets/images/') >= 0, '路线卡应使用本地图片');
});
```

在 `tests/ui.test.js` 中加入：

```javascript
QY.test('首页主视觉包含图片和替代文字', function () {
  document.body.innerHTML = '<section id="view-home"></section><section id="view-plans"></section>';
  QY.renderHome();
  var image = document.querySelector('.hero-visual img');
  QY.assert.ok(image, '首页主视觉应包含图片');
  QY.assert.ok(image.getAttribute('alt'), '首页主视觉图片应有替代文字');
});
```

在 `tests/next-ui.test.js` 中加入：

```javascript
QY.test('推荐揭晓卡包含目的地图片', function () {
  document.body.innerHTML = '<div id="surprise-result" data-excluded=""></div>';
  var input = { origin:'武汉', days:5, budget:3000, month:'10', companionType:'friends', interests:['古城'], startDate:'2026-10-01' };
  var results = QY.recommendDestinations(input, 'balanced');
  QY.renderSurprise({ main:results[0], alternatives:results.slice(1,3) });
  QY.assert.equal(document.querySelectorAll('.destination-image').length, 3, '主推荐和备选都应有图片');
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run: 使用计划开头的 Edge 测试命令。
Expected: 新增测试因缺少 `.hero-visual img`、`.destination-image` 或图片背景而失败。

- [ ] **Step 3: 创建本地 SVG 图片与映射**

每张 SVG 使用 1200×720 视口、无文字、无外部链接，统一采用“天空渐变 + 远景层 + 地标层 + 前景层”结构。九张路线图分别表达：

- `route-city.svg`：城市天际线、桥梁和夜景。
- `route-coast.svg`：海岸、浪花和灯塔。
- `route-garden.svg`：园林窗户、柳树和石桥。
- `route-mountain.svg`：雪山、森林和山路。
- `route-grassland.svg`：草原、云影和远处车辆。
- `route-desert.svg`：沙丘、驼队和落日。
- `route-plateau.svg`：高原列车、雪山和经幡。
- `route-old-town.svg`：古城屋檐、灯笼和山城台阶。
- `hero-journey.svg`：折叠地图、山河路径、日落和旅行背包的组合。

创建 `js/core/visuals.js`：

```javascript
(function () {
  var root = window.QY = window.QY || {};
  var cityImage = {
    '上海':'assets/images/route-city.svg', '重庆':'assets/images/route-city.svg', '广州':'assets/images/route-city.svg',
    '青岛':'assets/images/route-coast.svg', '厦门':'assets/images/route-coast.svg', '三亚':'assets/images/route-coast.svg',
    '苏州':'assets/images/route-garden.svg', '杭州':'assets/images/route-garden.svg', '扬州':'assets/images/route-garden.svg',
    '张家界':'assets/images/route-mountain.svg', '黄山':'assets/images/route-mountain.svg', '稻城':'assets/images/route-mountain.svg',
    '呼伦贝尔':'assets/images/route-grassland.svg', '伊犁':'assets/images/route-grassland.svg',
    '敦煌':'assets/images/route-desert.svg', '喀什':'assets/images/route-desert.svg',
    '拉萨':'assets/images/route-plateau.svg', '西宁':'assets/images/route-plateau.svg',
    '西安':'assets/images/route-old-town.svg', '洛阳':'assets/images/route-old-town.svg', '平遥':'assets/images/route-old-town.svg'
  };
  root.VISUALS = { hero:'assets/images/hero-journey.svg', cityImage:cityImage };
  root.imageForCity = function (name) { return cityImage[name] || 'assets/images/route-mountain.svg'; };
  root.imageForRoute = function (route) {
    return route.image || root.imageForCity(route.destination);
  };
}());
```

为 `QY.HOT_ROUTES` 中每条路线增加 `image` 字段，使用上面对应的 SVG 路径。

- [ ] **Step 4: 将图片接入页面**

- 首页主视觉增加：

```html
<div class="hero-visual"><img src="assets/images/hero-journey.svg" alt="山河与旅行路线插画"></div>
```

- 热门路线卡使用：

```javascript
'<div class="route-cover" style="background-image:linear-gradient(rgba(23,33,27,.32),rgba(23,33,27,.5)),url(' + root.imageForRoute(route) + ')">'
```

- 推荐结果项增加：

```html
<img class="destination-image" src="..." alt="目的地风景">
```

- 路线详情头图使用同一张路线图片，并保留深色遮罩保证文字可读。

- 社区内容卡使用目的地图片作为缩略图，缺少图片时回退到 `route-mountain.svg`。

- [ ] **Step 5: 运行测试和截图验收**

Run: 使用计划开头的 Edge 测试命令。
Expected: `FAIL 0`。

生成首页、路线详情和惊喜推荐截图，确认图片加载、文字对比度、移动端裁切和替代文字均正确。

- [ ] **Step 6: 检查点**

```powershell
git add assets/images js/core/visuals.js js/data/routes.js js/ui/home.js js/ui/next.js js/ui/routes.js js/ui/community.js tests/ui.test.js tests/next-ui.test.js tests/routes-ui.test.js tests/test-runner.html styles.css
git commit -m "feat: add local scenic artwork across core views"
```

---

### Task 9: 旅人现场、我的与首页内容流

**Files:**
- Modify: `js/app.js`
- Modify: `js/ui/home.js`
- Modify: `js/ui/routes.js`
- Create: `js/ui/community.js`
- Create: `js/ui/my.js`
- Create: `tests/community-ui.test.js`
- Modify: `tests/test-runner.html`
- Modify: `styles.css`

**Interfaces:**
- Consumes: `QY.listPosts()`、`QY.groupPosts(posts)`、`QY.createPost(data)`、`QY.addComment(postId,text)`、`QY.toggleLike(postId)`、`QY.store.read()`、`QY.store.toggleFavorite(routeId)`。
- Produces: `QY.renderCommunityPreview()`、`QY.renderCommunityPage()`、`QY.renderMyPage()`、`QY.renderAllPages()`。

- [ ] **Step 1: 写失败测试**

创建 `tests/community-ui.test.js`：

```javascript
QY.test('旅人现场按路线显示聚合主题和发布表单', function () {
  QY.store.reset();
  document.body.innerHTML = '<section id="view-community"></section>';
  QY.renderCommunityPage();
  QY.assert.ok(document.body.textContent.indexOf('旅人现场') >= 0, '应显示社区标题');
  QY.assert.ok(document.body.textContent.indexOf('只看真去过的人怎么说') >= 0, '应显示副标题');
  QY.assert.ok(document.querySelector('#community-post-form'), '应显示发布表单');
  QY.assert.ok(document.querySelectorAll('.route-topic').length >= 2, '应显示路线主题');
  QY.store.reset();
});

QY.test('我的页面展示已保存方案和收藏路线', function () {
  QY.store.reset();
  QY.store.savePlan({ id:'saved-1', title:'武汉到成都', plan:{ label:'均衡推荐', totalCost:{ normal:1800 } } });
  QY.store.toggleFavorite('wuhan-chengdu');
  document.body.innerHTML = '<section id="view-my"></section>';
  QY.renderMyPage();
  QY.assert.ok(document.body.textContent.indexOf('武汉到成都') >= 0, '应展示保存方案');
  QY.assert.ok(document.body.textContent.indexOf('从江城吃到天府') >= 0, '应展示收藏路线');
  QY.store.reset();
});
```

修改 `tests/test-runner.html`，在 `routes.js` 后加入：

```html
<script src="../js/ui/community.js"></script>
<script src="../js/ui/my.js"></script>
```

加入测试脚本：

```html
<script src="../tests/community-ui.test.js"></script>
```

- [ ] **Step 2: 运行测试并确认失败**

Run: 使用计划开头的 Edge 测试命令。
Expected: 新测试因 `QY.renderCommunityPage` 或 `QY.renderMyPage` 未定义而失败。

- [ ] **Step 3: 实现社区和我的**

创建 `js/ui/community.js`：

```javascript
(function () {
  var root = window.QY = window.QY || {};

  function routeOptions() {
    return '<option value="">请选择热门路线</option>' + root.HOT_ROUTES.map(function (route) {
      return '<option value="' + route.id + '">' + root.escapeHtml(route.origin + ' → ' + route.waypoints.join(' → ') + ' → ' + route.destination) + '</option>';
    }).join('');
  }

  function postCard(post) {
    return [
      '<article class="post-card" data-post-id="' + post.id + '">',
      '<div class="post-meta"><strong>' + root.escapeHtml(post.author) + '</strong><span>人均 ¥' + Number(post.cost).toLocaleString('zh-CN') + '</span></div>',
      '<h3>' + root.escapeHtml(post.title) + '</h3>',
      '<p>' + root.escapeHtml(post.content) + '</p>',
      '<div class="post-actions"><button type="button" data-like="' + post.id + '">' + (post.liked ? '已赞 ' : '点赞 ') + post.likes + '</button><span>' + post.comments.length + ' 条讨论</span></div>',
      '<div class="comments">' + post.comments.map(function (comment) { return '<p><strong>' + root.escapeHtml(comment.author) + '</strong> ' + root.escapeHtml(comment.text) + '</p>'; }).join('') + '</div>',
      '<form class="comment-form" data-comment-form="' + post.id + '"><input name="comment" placeholder="补充你的心得或提问"><button type="submit">发送</button></form>',
      '</article>'
    ].join('');
  }

  function bindPostActions(view) {
    view.querySelectorAll('[data-like]').forEach(function (button) {
      button.addEventListener('click', function () {
        root.toggleLike(button.getAttribute('data-like'));
        root.renderCommunityPage();
      });
    });
    view.querySelectorAll('[data-comment-form]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var postId = form.getAttribute('data-comment-form');
        if (root.addComment(postId, form.querySelector('[name="comment"]').value)) root.renderCommunityPage();
      });
    });
  }

  root.renderCommunityPreview = function () {
    var home = document.getElementById('view-home');
    if (!home) return;
    var section = document.createElement('section');
    section.id = 'community-preview';
    section.className = 'content-section';
    section.innerHTML = '<div class="section-head"><div><p class="eyebrow">旅人现场</p><h2>只看真去过的人怎么说</h2></div><button type="button" class="text-button" data-open-community>进入现场</button></div>' +
      root.listPosts().slice(0, 2).map(postCard).join('');
    home.appendChild(section);
    section.querySelector('[data-open-community]').addEventListener('click', function () { root.navigate('community'); });
    bindPostActions(section);
  };

  root.renderCommunityPage = function () {
    var view = document.getElementById('view-community');
    if (!view) return;
    var groups = root.groupPosts(root.listPosts());
    view.innerHTML = [
      '<section class="hero-card community-hero"><p class="eyebrow">旅人现场</p><h1>只看真去过的人怎么说</h1><p>真人、真路线、真花费、真避坑。</p></section>',
      '<details class="panel publish-panel"><summary>发布我的路线经验</summary><form id="community-post-form" class="post-form"><label>路线<select name="routeId" required>' + routeOptions() + '</select></label><div class="field-grid"><label>人均花费<input name="cost" type="number" min="0" placeholder="980"></label><label>旅行天数<input name="days" type="number" min="1" value="5"></label></div><label>标题<input name="title" required placeholder="例如：980 元走完武汉到成都"></label><label>经验正文<textarea name="content" required placeholder="交通、住宿、花费和避坑经验"></textarea></label><button class="primary-button" type="submit">发布到对应路线</button></form></details>',
      '<section class="topic-list">' + groups.map(function (group) {
        return '<section class="route-topic"><div class="section-head"><div><p class="eyebrow">路线主题</p><h2>' + root.escapeHtml(group.title) + '</h2></div><span>' + group.posts.length + ' 条经验</span></div>' + group.posts.map(postCard).join('') + '</section>';
      }).join('') + '</section>'
    ].join('');
    bindPostActions(view);
    view.querySelector('#community-post-form').addEventListener('submit', function (event) {
      event.preventDefault();
      var form = event.currentTarget;
      var route = root.getHotRoute(form.querySelector('[name="routeId"]').value);
      if (!route) return;
      root.createPost({
        origin:route.origin, destination:route.destination, days:form.querySelector('[name="days"]').value,
        cost:form.querySelector('[name="cost"]').value, title:form.querySelector('[name="title"]').value,
        content:form.querySelector('[name="content"]').value
      });
      root.renderCommunityPage();
    });
  };
}());
```

创建 `js/ui/my.js`：

```javascript
(function () {
  var root = window.QY = window.QY || {};

  root.renderMyPage = function () {
    var view = document.getElementById('view-my');
    if (!view) return;
    var state = root.store.read();
    var plans = state.savedPlans.map(function (item) {
      var plan = item.plan || {};
      return '<article class="saved-plan"><div><strong>' + root.escapeHtml(item.title) + '</strong><p>' + root.escapeHtml(plan.label || '已保存方案') + '</p></div><span>' + (plan.totalCost ? '¥' + Number(plan.totalCost.normal).toLocaleString('zh-CN') : '') + '</span></article>';
    }).join('');
    var favorites = state.favorites.map(function (id) {
      var route = root.getHotRoute(id);
      return route ? '<article class="saved-plan"><div><strong>' + root.escapeHtml(route.title) + '</strong><p>' + root.escapeHtml([route.origin].concat(route.waypoints).concat(route.destination).join(' → ')) + '</p></div><span>已收藏</span></article>' : '';
    }).join('');
    view.innerHTML = '<section class="hero-card my-hero"><p class="eyebrow">我的</p><h1>你的路线和收藏</h1><p>所有内容暂存在当前浏览器。</p></section><section class="panel"><h2>已保存方案</h2>' + (plans || '<p class="empty-state">还没有保存方案，先去首页生成三套方案吧。</p>') + '</section><section class="panel"><h2>收藏路线</h2>' + (favorites || '<p class="empty-state">还没有收藏路线。</p>') + '</section>';
  };
}());
```

修改 `js/ui/home.js`，在调用 `renderHotRoutes` 后加入：

```javascript
    if (root.renderCommunityPreview) root.renderCommunityPreview();
```

修改 `js/ui/routes.js` 的路由卡按钮区域，在“查看途径点”前加入收藏按钮：

```javascript
'<button type="button" class="text-button" data-favorite-route="' + route.id + '">' + (root.store.read().favorites.indexOf(route.id) >= 0 ? '已收藏' : '收藏路线') + '</button>' +
```

在 `renderHotRoutes` 的按钮绑定前加入：

```javascript
    section.querySelectorAll('[data-favorite-route]').forEach(function (button) {
      button.addEventListener('click', function () {
        root.store.toggleFavorite(button.getAttribute('data-favorite-route'));
        root.renderHome();
        root.renderMyPage();
      });
    });
```

修改 `js/app.js` 的 `root.start`，在绑定导航前加入：

```javascript
    if (root.renderAllPages) root.renderAllPages();
```

在 `js/app.js` 中加入 `renderAllPages`：

```javascript
  root.renderAllPages = function () {
    root.renderHome();
    root.renderNextPage();
    root.renderCommunityPage();
    root.renderMyPage();
  };
```

在 `styles.css` 中追加：

```css
.community-hero, .my-hero { background: linear-gradient(145deg, #513629, #17211b); }
.publish-panel summary { cursor: pointer; font-size: 18px; font-weight: 900; }
.post-form { display: grid; gap: 12px; margin-top: 16px; }
.post-form input, .post-form select, .post-form textarea, .comment-form input { width: 100%; min-height: 48px; padding: 10px 12px; border: 1px solid var(--line); border-radius: 14px; background: #fafbf8; }
.post-form textarea { min-height: 110px; resize: vertical; }
.route-topic { margin-top: 22px; padding-top: 18px; border-top: 1px solid var(--line); }
.post-card { margin-top: 12px; padding: 16px; border: 1px solid var(--line); border-radius: 20px; background: #fff; box-shadow: var(--shadow); }
.post-meta, .post-actions { display: flex; justify-content: space-between; align-items: center; gap: 8px; color: var(--muted); font-size: 13px; }
.post-card p { line-height: 1.65; }
.post-card button, .comment-form button { padding: 8px 12px; color: var(--brand-dark); background: #fff0eb; }
.comments { margin-top: 10px; padding: 10px; border-radius: 12px; background: #f7f8f4; font-size: 13px; }
.comments p { margin: 4px 0; }
.comment-form { display: grid; grid-template-columns: 1fr auto; gap: 8px; margin-top: 10px; }
.saved-plan { display: flex; justify-content: space-between; gap: 12px; padding: 14px 0; border-bottom: 1px solid var(--line); }
.saved-plan p { margin: 4px 0 0; color: var(--muted); }
.empty-state { color: var(--muted); }
```

- [ ] **Step 4: 运行测试并确认通过**

Run: 使用计划开头的 Edge 测试命令。
Expected: `FAIL 0`，旅人现场和我的页面测试通过。

- [ ] **Step 5: 手动验收**

首页下方应依次出现“下一站，未知”、热门路线和“旅人现场”；社区可以按路线发布、点赞和评论；保存方案或收藏热门路线后，“我的”页面能显示对应内容。

- [ ] **Step 6: 检查点**

```powershell
git add js/app.js js/ui/home.js js/ui/routes.js js/ui/community.js js/ui/my.js styles.css tests/test-runner.html tests/community-ui.test.js
git commit -m "feat: add route community and personal library"
```
---

### Task 10: 实时数据接口边界、行为记录与错误状态

**Files:**
- Modify: `index.html`
- Modify: `tests/test-runner.html`
- Modify: `js/app.js`
- Modify: `js/ui/home.js`
- Modify: `js/ui/plans.js`
- Modify: `js/ui/next.js`
- Modify: `js/ui/community.js`
- Create: `js/core/analytics.js`
- Create: `js/core/provider.js`
- Create: `tests/provider.test.js`
- Modify: `styles.css`

**Interfaces:**
- Consumes: `QY.generatePlans(input)`、`QY.store.read/write`。
- Produces: `QY.track(eventName,payload)`、`QY.provider.search(input)`、`QY.provider.bookingAction(plan)`、`QY.showToast(message)`。

- [ ] **Step 1: 写失败测试**

创建 `tests/provider.test.js`：

```javascript
QY.test('模拟数据提供器明确标记非实时结果', function () {
  var result = QY.provider.search({
    budget:3000, travellers:2, companionType:'friends', origin:'武汉', destination:'成都',
    waypoints:['重庆'], startDate:'2026-10-01', days:7,
    modes:['plane','train','coach','rental'], priority:'balanced'
  });
  QY.assert.equal(result.isRealtime, false);
  QY.assert.equal(result.source, 'mock');
  QY.assert.ok(result.message.indexOf('尚未接入') >= 0, '应明确提示尚未接入实时数据');
});

QY.test('没有授权链接时不开放购票跳转', function () {
  var action = QY.provider.bookingAction({ label:'均衡推荐' });
  QY.assert.equal(action.enabled, false);
  QY.assert.equal(action.url, null);
});

QY.test('行为记录写入本地状态并限制长度', function () {
  QY.store.reset();
  QY.track('test_event', { value:1 });
  QY.assert.equal(QY.store.read().analytics[0].name, 'test_event');
  QY.assert.equal(QY.store.read().analytics[0].payload.value, 1);
  QY.store.reset();
});
```

修改 `tests/test-runner.html`，在 `constant.js` 后加入：

```html
<script src="../js/core/analytics.js"></script>
<script src="../js/core/provider.js"></script>
```

加入测试脚本：

```html
<script src="../tests/provider.test.js"></script>
```

- [ ] **Step 2: 运行测试并确认失败**

Run: 使用计划开头的 Edge 测试命令。
Expected: 新测试因 `QY.provider` 或 `QY.track` 未定义而失败。

- [ ] **Step 3: 实现接口边界和行为记录**

创建 `js/core/analytics.js`：

```javascript
(function () {
  var root = window.QY = window.QY || {};

  root.track = function (eventName, payload) {
    var state = root.store.read();
    state.analytics.unshift({ name:String(eventName), payload:payload || {}, at:new Date().toISOString() });
    state.analytics = state.analytics.slice(0, 200);
    root.store.write(state);
    return state.analytics[0];
  };
}());
```

创建 `js/core/provider.js`：

```javascript
(function () {
  var root = window.QY = window.QY || {};

  root.provider = {
    statusMessage:'实时数据服务尚未接入，当前显示模拟预估。',
    search: function (input) {
      return {
        source:'mock',
        isRealtime:false,
        items:root.generatePlans(input),
        bookingUrl:null,
        message:root.provider.statusMessage
      };
    },
    bookingAction: function () {
      return {
        enabled:false,
        url:null,
        label:'官方购票渠道尚未接入'
      };
    }
  };
}());
```

在 `index.html` 中，将 `analytics.js` 放在 `constants.js` 后：

```html
<script src="js/core/analytics.js"></script>
```

将 `provider.js` 放在 `planner.js` 后：

```html
<script src="js/core/provider.js"></script>
```

修改 `js/ui/home.js` 的 `showPlans`，将 `generatePlans` 调用替换为：

```javascript
    var plans;
    try {
      plans = root.generatePlans(input);
    } catch (error) {
      error.textContent = '暂时无法生成方案：' + error.message;
      return false;
    }
    root.track('plans_generated', { origin:input.origin, destination:input.destination, days:input.days });
```

修改 `js/ui/plans.js` 的 `planCard`，在数据来源后加入：

```javascript
      '<p class="provider-status">' + root.escapeHtml(root.provider.statusMessage) + '</p>',
      '<button type="button" class="text-button" data-booking="' + plan.id + '">查看购票入口</button>',
```

在 `renderPlans` 保存按钮绑定后加入：

```javascript
    view.querySelectorAll('[data-booking]').forEach(function (button) {
      button.addEventListener('click', function () {
        var plan = plans.find(function (item) { return item.id === button.getAttribute('data-booking'); });
        var action = root.provider.bookingAction(plan);
        root.track('booking_clicked', { strategy:plan.strategy, enabled:action.enabled });
        root.showToast(action.label);
      });
    });
```

在 `renderPlans` 保存点击成功后加入：

```javascript
        root.track('plan_saved', { strategy:plan.strategy });
```

修改 `js/ui/next.js`：

- 在 `runSurprise` 成功生成结果后加入：

```javascript
    root.track('surprise_revealed', { origin:input.origin, main:result.main.city.name });
```

- 在 `root.prefillPlan` 设置表单后加入：

```javascript
    root.track('recommendation_accepted', { destination:input.destination, days:input.days, budget:input.budget });
```

- 在 `renderNextTeaser` 的按钮点击事件中，在导航前加入：

```javascript
      root.track('surprise_opened', { from:'home' });
```

修改 `js/ui/community.js`：

- 在点赞后加入：

```javascript
        root.track('post_liked', { postId:button.getAttribute('data-like') });
```

- 在评论成功后加入：

```javascript
        root.track('comment_added', { postId:postId });
```

- 在发布成功后加入：

```javascript
      root.track('post_created', { routeId:route.id });
```

修改 `js/app.js`，在 `root.navigate` 后加入：

```javascript
  root.showToast = function (message) {
    var oldToast = document.getElementById('toast');
    if (oldToast) oldToast.remove();
    var toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.textContent = message;
    document.body.appendChild(toast);
    window.setTimeout(function () {
      if (toast.parentElement) toast.remove();
    }, 3200);
  };
```

在 `styles.css` 中追加：

```css
.provider-status { padding: 10px 12px; border-radius: 12px; background: #fff8e5; color: #7a5b00; font-size: 13px; }
.toast { position: fixed; left: 50%; bottom: 92px; z-index: 40; width: min(460px, calc(100% - 32px)); transform: translateX(-50%); padding: 14px 16px; border-radius: 16px; color: #fff; background: rgba(23,33,27,.94); box-shadow: var(--shadow); }
```

- [ ] **Step 4: 运行测试并确认通过**

Run: 使用计划开头的 Edge 测试命令。
Expected: `FAIL 0`，数据提供器和行为记录测试通过。

- [ ] **Step 5: 手动验收**

打开任意方案并点击“查看购票入口”，页面应提示“官方购票渠道尚未接入”，不能打开伪造链接；生成方案、揭晓推荐、点赞、评论和保存后，本地行为记录应增加。

- [ ] **Step 6: 检查点**

```powershell
git add index.html styles.css js/app.js js/core/analytics.js js/core/provider.js js/ui/home.js js/ui/plans.js js/ui/next.js js/ui/community.js tests/test-runner.html tests/provider.test.js
git commit -m "feat: add provider boundary and local analytics"
```
---

### Task 11: 端到端验收、响应式收尾与使用说明

**Files:**
- Modify: `tests/test-runner.html`
- Create: `tests/e2e.test.js`
- Create: `README.md`
- Modify: `styles.css`

**Interfaces:**
- Consumes: 所有已完成模块。
- Produces: 可独立运行的最终原型和一套完整回归测试。

- [ ] **Step 1: 写端到端失败测试**

创建 `tests/e2e.test.js`：

```javascript
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

  QY.renderRouteDetail('wuhan-chengdu');
  QY.assert.equal(document.querySelectorAll('.route-segment').length, 2, '途径点详情应有两段');

  QY.renderCommunityPage();
  QY.assert.ok(document.querySelector('.route-topic'), '旅人现场应有路线主题');
  QY.assert.ok(document.body.textContent.indexOf('组队') === -1, '第一版不应显示组队入口');
  QY.store.reset();
});
```

确保 `tests/test-runner.html` 最终按以下顺序加载源码：

```html
<script src="../tests/assert.js"></script>
<script src="../js/core/constants.js"></script>
<script src="../js/core/utils.js"></script>
<script src="../js/data/cities.js"></script>
<script src="../js/data/routes.js"></script>
<script src="../js/data/community.js"></script>
<script src="../js/core/store.js"></script>
<script src="../js/core/analytics.js"></script>
<script src="../js/core/planner.js"></script>
<script src="../js/core/recommender.js"></script>
<script src="../js/core/community.js"></script>
<script src="../js/core/provider.js"></script>
<script src="../js/ui/home.js"></script>
<script src="../js/ui/plans.js"></script>
<script src="../js/ui/next.js"></script>
<script src="../js/ui/routes.js"></script>
<script src="../js/ui/community.js"></script>
<script src="../js/ui/my.js"></script>
<script src="../js/app.js"></script>
<script src="../tests/smoke.test.js"></script>
<script src="../tests/store.test.js"></script>
<script src="../tests/planner.test.js"></script>
<script src="../tests/recommender.test.js"></script>
<script src="../tests/community.test.js"></script>
<script src="../tests/ui.test.js"></script>
<script src="../tests/next-ui.test.js"></script>
<script src="../tests/routes-ui.test.js"></script>
<script src="../tests/community-ui.test.js"></script>
<script src="../tests/provider.test.js"></script>
<script src="../tests/e2e.test.js"></script>
<script>window.addEventListener('DOMContentLoaded', QY.runTests);</script>
```

- [ ] **Step 2: 运行测试并确认新增端到端测试先失败**

Run: 使用计划开头的 Edge 测试命令。
Expected: 如果前面的任务尚未真正实现，端到端测试会因缺少元素或函数失败；完成所有前置实现后应通过。

- [ ] **Step 3: 完成响应式和无障碍收尾**

在 `styles.css` 末尾加入：

```css
@media (max-width: 380px) {
  .view { padding: 14px; }
  .hero-card h1 { font-size: 28px; }
  .field-grid { grid-template-columns: 1fr; }
  .surprise-alt { display: block; width: 100%; }
  .horizontal-list { grid-auto-columns: 92%; }
  .route-segment { display: block; }
  .route-segment > span { display: block; margin-top: 8px; text-align: left; }
}

button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible, summary:focus-visible {
  outline: 3px solid #f7c948;
  outline-offset: 2px;
}

button:disabled { cursor: default; opacity: .62; }
```

创建 `README.md`：

```markdown
# 穷游路线规划 Web 原型

面向国内学生和年轻背包客的手机优先 Web 原型，包含路线规划、途径点、三套方案比较、“下一站，未知”目的地推荐和“旅人现场”路线社区。

## 当前范围

- 支持所有省级行政中心省会、首府、直辖市和热门旅游城市。
- 城市间交通、票价、耗时和游玩费用均为模拟预估。
- 不开放组队、实名认证、站内支付或订单售后。
- 没有真实数据权限前，购票按钮只提示“官方购票渠道尚未接入”。
- 保存方案、收藏、发布、点赞和评论只保存在当前浏览器。

## 运行

直接双击 `index.html`，或在 PowerShell 中运行：

```powershell
Start-Process '.\index.html'
```

页面不需要安装依赖，也不需要启动本地服务器。

## 测试

```powershell
$uri = [System.Uri]::new((Resolve-Path '.\tests\test-runner.html').Path).AbsoluteUri
& 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe' --headless=new --disable-gpu --allow-file-access-from-files --dump-dom $uri
```

成功输出必须包含：

```text
TEST_RESULTS: PASS <数量> FAIL 0
```

## 目录

- `index.html`：应用入口。
- `styles.css`：移动端样式。
- `js/core`：路线、推荐、社区、存储、接口和记录逻辑。
- `js/data`：城市、热门路线和社区种子数据。
- `js/ui`：各页面渲染与交互。
- `docs/superpowers/specs`：产品设计稿。
- `docs/superpowers/plans`：实施计划。
- `tests`：无依赖测试。
```

- [ ] **Step 4: 运行完整测试**

Run: 使用计划开头的 Edge 测试命令。
Expected: 输出包含 `TEST_RESULTS`，且 `FAIL 0`。

- [ ] **Step 5: 最终手工验收**

使用 Edge 按以下顺序检查：

1. 首页首屏直接显示预算、人数、出发地、目的地、日期、天数、交通方式和“生成 3 套穷游方案”。
2. 添加一个途径点后生成三套方案，比较表中出现两段城际交通汇总。
3. 点击首页“给我一个惊喜”，揭晓一个主推荐和两个备选；点击“就它了”能带回规划表单。
4. 打开热门路线详情，确认途径点、每段模拟费用和“一键带入我的规划”可用。
5. 在“旅人现场”发布经验、点赞和评论，确认内容归入正确路线主题。
6. 保存方案和收藏路线后，在“我的”中再次看到内容。
7. 刷新页面，本地保存内容仍然存在。
8. 确认页面没有任何组队入口，也没有伪造的实时班次或购票链接。

- [ ] **Step 6: 检查点**

```powershell
git add README.md styles.css tests/test-runner.html tests/e2e.test.js
git commit -m "test: add end-to-end verification and usage guide"
```

---

## Plan Self-Review

### Spec Coverage

- 产品定位、目标用户和范围：Task 1、Task 2、Task 11。
- 首页直接规划：Task 6。
- 三套方案与比较：Task 3、Task 6。
- 途径点和热门路线：Task 3、Task 5、Task 8。
- “下一站，未知”与排序筛选：Task 4、Task 7。
- “旅人现场”与路线聚合：Task 5、Task 9。
- 方案保存、收藏和我的：Task 2、Task 9。
- 模拟数据、实时接口边界和购票跳转：Task 10。
- 错误处理、行为记录和验收：Task 10、Task 11。
- 不开放组队和实名认证：Task 11 包含“组队”文字缺失断言，所有界面任务没有创建组队入口。

### Placeholder Scan

计划中不包含 TBD、TODO、待定实现或要求执行者自行补全业务代码的占位内容。所有测试、实现、运行命令和验收动作均给出了具体内容。

### Type Consistency

- 输入对象统一使用 `budget、travellers、companionType、origin、destination、waypoints、startDate、days、modes、priority`。
- 方案对象统一使用 `strategy、label、totalCost.min、totalCost.normal、budgetBalance、totalHours、transfers、latestArrival、route、segments、dataSource`。
- 推荐项统一使用 `city、totalCost、hours、transfers、seasonal、score、reason`。
- 社区帖子统一使用 `id、origin、destination、days、cost、author、title、content、likes、liked、comments`。
- 路线数据统一使用 `id、title、origin、waypoints、destination、days、budget、modes`。
- 所有模块通过 `window.QY` 通信，不引入未定义的模块导入。