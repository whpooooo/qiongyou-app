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