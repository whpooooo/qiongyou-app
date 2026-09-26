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
      '<div class="post-cover" style="background-image:linear-gradient(rgba(23,33,27,.08),rgba(23,33,27,.45)),url(' + root.imageForCity(post.destination) + ')"><span>' + root.escapeHtml(post.destination) + '</span></div>',
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
        root.track('post_liked', { postId:button.getAttribute('data-like') });
        root.renderCommunityPage();
      });
    });
    view.querySelectorAll('[data-comment-form]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var postId = form.getAttribute('data-comment-form');
        if (root.addComment(postId, form.querySelector('[name="comment"]').value)) {
          root.track('comment_added', { postId:postId });
          root.renderCommunityPage();
        }
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
      root.track('post_created', { routeId:route.id });
      root.renderCommunityPage();
    });
  };
}());