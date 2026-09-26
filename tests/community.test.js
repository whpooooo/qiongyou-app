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