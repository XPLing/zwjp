/**
 * @param singerLoadFn: 每个img加载完成后的回调
 * @param allLoadFn: 当全部img加载完成后的回调
 *
 * */
export function imgOnload (imgs, vm, flag, singerLoadFn, allLoadFn) {
  return new Promise(function (resolve, reject) {
    var loaded = [];
    for (var i = 0, len = imgs.length; i < len; i++) {
      var img = imgs[i], src = img.src;
      var imgObj = new Image();
      var me = vm;
      (function (i, imgObj) {
        imgObj.onload = function () {
          // singerLoadFn && singerLoadFn();
          // if (i === len - 1) {
          //   me[flag] = true;
          //   allLoadFn && allLoadFn();
          // }
          loaded.push(i);
          imgObj = null;
          resolve({
            index: i,
            loaded: loaded
          });
        };
        imgObj.onerror = function () {
          loaded.push(i);
          imgObj = null;
          reject({
            index: i,
            loaded: loaded
          });
        };
        imgObj.src = src;
      })(i, imgObj);
    }
    // console.log(loaded);
    // return loaded;
  });

}
