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

  root.registerServiceWorker = function () {
    if (!('serviceWorker' in navigator)) return;
    var isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    if (location.protocol !== 'https:' && !isLocalhost) return;
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('./service-worker.js').catch(function (error) {
        console.warn('Service Worker 注册失败：', error);
      });
    });
  };
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
  root.renderAllPages = function () {
    root.renderHome();
    root.renderNextPage();
    root.renderCommunityPage();
    root.renderMyPage();
  };
  root.start = function () {
    if (root.renderAllPages) root.renderAllPages();
    else if (root.renderHome) root.renderHome();
    document.querySelectorAll('[data-nav]').forEach(function (button) {
      button.addEventListener('click', function () {
        root.navigate(button.getAttribute('data-nav'));
      });
    });
    root.navigate('home');
  };

  window.addEventListener('DOMContentLoaded', root.start);
  root.registerServiceWorker();
}());