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