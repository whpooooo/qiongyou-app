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