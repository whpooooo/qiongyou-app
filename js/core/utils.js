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

  root.escapeHtml = function (value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char];
    });
  };
  root.routeKey = function (origin, destination, days) {
    var bucket = Number(days) <= 3 ? '1-3' : Number(days) <= 5 ? '4-5' : '6+';
    return [origin, destination, bucket].join('__');
  };
}());