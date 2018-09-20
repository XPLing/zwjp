function formatDate (timeStamp, fmt) {
  if (!timeStamp) {
    return '';
  }
  var time = new Date(timeStamp);
  var y, m, d, h, min, second, result;
  y = time.getFullYear();
  m = time.getMonth() + 1;
  d = time.getDate();
  h = time.getHours();
  min = time.getMinutes();
  second = time.getSeconds();

  var res;
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (y + '').substr(4 - RegExp.$1.length));
  }

  var o = {
    'M+': time.getMonth() + 1,
    'd+': time.getDate(),
    'h+': time.getHours(),
    'm+': time.getMinutes(),
    's+': time.getSeconds()
  };
  for (var k in o) {
    var reg = new RegExp('(' + k + ')');
    if (reg.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? o[k] : padLeftZero((o[k] + '')));
    }

  }
  return fmt;
}

function padLeftZero (str) {
  return ('00' + str).substr(str.length);
}

function ellipsis (str, limit) {
  if (str.length > limit) {
    str = `${str.substr(0, limit)}...`;
  }
  return str;
}

export {
  formatDate,
  ellipsis
};
