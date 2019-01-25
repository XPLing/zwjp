/**
 * Created by XPL on 2017/6/11.
 */
;(function (win, doc) {
  'user strict';
  var common = {
    initial: function () {
      // window.outerWidth  在ios中为0，所以改为screen.width
      var windowW = parseInt(window.outerWidth || window.innerWidth || window.screen.width || window.screen.availWidth);
      // windowW = windowW > 1400 ? 1400 : windowW;
      // alert('width:' + windowW + '\nheight:' + window.outerHeight + '\n userAgent:' + navigator.appVersion + '\n appVersion:' + navigator.appVersion);
      document.getElementsByTagName('html')[0].style.fontSize = windowW / 10 + 'px';
    }
  };
  common.initial();
}(window, document));


