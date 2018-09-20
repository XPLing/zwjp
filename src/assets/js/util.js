var browser = {
  versions: (function () {
    var u = navigator.userAgent, app = navigator.appVersion;
    return { // 移动终端浏览器版本信息
      trident: u.indexOf('Trident') > -1, // IE内核
      presto: u.indexOf('Presto') > -1, // opera内核
      webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, // 火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或uc浏览器
      iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, // 是否iPad
      webApp: u.indexOf('Safari') == -1 // 是否web应该程序，没有头部与底部
    };
  })(),
  language: (navigator.browserLanguage || navigator.language).toLowerCase()
};


function getbrowserType() {
  if (browser.versions.mobile) {
    var ua = navigator.userAgent.toLowerCase();// 获取判断用的对象
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      if (browser.versions.android) {
        return 1.1;
      } else if (browser.versions.ios) {
        return 1.2;
      }
      return 1;
    }
    if (browser.versions.ios) {
      return 2;
    }
    if (browser.versions.android) {
      // 是否在安卓浏览器打开
      return 3;
    }
  } else {
    // 是否在桌面浏览器打开
    if (browser.versions.trident) {
      return 4;
    }
    return 0;
  }
};

function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}


var util = {
  variable: {
    click: browser.versions.mobile ? 'touchstart' : 'click',
    downAppUrl: '',
    scheme: '',
    ajaxUrl: '', // /[http|https]:\/\/localhost/.test(decodeURIComponent(window.location.href)) ? /localhost:(?=8787)/.test(decodeURIComponent(window.location.href)) ? '' : 'http://localhost:8787' : /[http|https]:\/\/192.168/.test(decodeURIComponent(window.location.href)) ? decodeURIComponent(window.location.href).replace(/([http|https]:\/\/[^:]*).*/, '$1:8787') : ''
    ajaxUrlPro: '',
    scale: 100,
    robot: {
      url: 'http://www.tuling123.com/openapi/api',
      urlv2: 'http://openapi.tuling123.com/openapi/api/v2',
      key: '142ae7cfe83143819a528feafba21ce2'
    },
    uploadFilesUrl_multiple: '/multipart_Upload',
    uploadFilesUrl_single: '/multipart_Upload',
    businessUploadFilesUrl_multiple: '/infoDoc/form/multipart_Upload',
    businessUploadFilesUrl_single: '/infoDoc/form/multipart_Upload',
    requestState: {
      ok: '200'
    }
  },
  alert_autoHide: function (msg, type) {
    var mesgElem = $('.c-message');
    mesgElem.show().find('.' + type).show().html('<strong>' + msg + '</strong>').siblings().hide();
    mesgElem.delay(3000).fadeOut();
  },
  letIE9: function () { // 判断是否低于ie9
    var browser = navigator.appName;
    var b_version = navigator.appVersion;
    var version = b_version.split(';');
    if (version.length > 1) {
      var trim_Version = parseInt(version[1].replace(/[ ]/g, '').replace(/MSIE/g, ''));
      if (trim_Version < 9) {
        return true;
      }
    }
    return false;
  },
  getRemJs: function () { // IE9以下加载rem.js
    var dtd = $.Deferred();
    if (util.getbrowserType === 4) {
      if (util.letIE9()) {
        $.getScript('http://file.kingbrother.com:8082/static/js/rem.min.js', function () {
          dtd.resolve();
        });

      } else {
        dtd.resolve();
      }
    } else {
      dtd.resolve();
    }
    return dtd.promise();
  },
  getbrowserType: getbrowserType(),
  browser: browser.versions,
  resetFontSize: function () {
    var windowW = parseInt(window.innerWidth || window.screen.width);
    windowW = windowW > 1440 ? 1440 : windowW;
    document.getElementsByTagName('html')[0].style.fontSize = windowW / this.variable.scale + 'px';
  },
  scrollFade: function (obj) {
    var offsetTop = obj.offset().top;
    var pageTop = $(document).scrollTop();
    var screen = $(window).height();
    if (pageTop + screen > offsetTop + 30) {
      obj.animate({'top': '0', 'opacity': '1'}, 500);
    }
    obj = null;
  },
  getServiceUrl: function (path) {
    var url = util.variable.ajaxUrl + path;
    return url;
  },
  request: function (param) {
    var dtd = $.Deferred();
    param.dtd = dtd;
    var opt = {
      type: param.method || 'GET',
      url: param.url || '',
      dataType: param.dataType || 'json',
      data: param.data || '',
      async: typeof param.async === 'boolean' ? param.async : true,
      beforeSend: function () {
        typeof param.beforeSend === 'function' && param.beforeSend(param);
      },
      success: function (data) {
        typeof param.successInit === 'function' && param.successInit(data, param);
        if (/^2.*/.test(data.code)) {
          typeof param.success === 'function' && param.success(data, param);
          dtd.resolve(data, param);
        } else {
          typeof param.error === 'function' && param.error(data, param);
          dtd.reject(data);
        }
      },
      error: function (error) {
        typeof param.error === 'function' && param.error(error, param);
        dtd.reject(error);
      }
    };
    if (param.contentType) {
      opt.contentType = param.contentType;
    }
    if (param.headers) {
      opt.headers = param.headers;
    }
    $.ajax(opt);
    return dtd.promise();
  },
  requestResult: {
    request_error: function (error, param) {
      console.log(error);
      var mesgElem = $('.c-message');
      mesgElem.show().find('.alert-danger').show().html('<strong>' + error.message + '</strong>').siblings().hide();
    }
  },
  scrollShowElem: function (distance, target, scrollWindow) {
    /*
     * 节点根据窗口滚动隐藏显示
     * @param distance [dom|number] 显示隐藏的基点
     * @param target [dom] 显示隐藏的节点
     * @param scrollWindow [dom] 滚动窗口
     * */
    var wScrollTop = scrollWindow.scrollTop();
    var baseDistance = '';
    if (typeof distance === 'number') {
      baseDistance = distance;
    } else {
      baseDistance = distance.offset().top;
    }
    baseDistance = parseInt(baseDistance);
    var isShow = this.isSlideToElem(baseDistance, scrollWindow);
    if (isShow) {
      if (target.is(':hidden')) {
        target.fadeIn();
      }
    } else {
      if (!target.is(':hidden')) {
        target.fadeOut();
      }
    }

  },
  isSlideToElem: function (distance, scrollWindow) {
    var wScrollTop = scrollWindow.scrollTop();
    var baseDistance = 0;
    baseDistance = Number(distance);
    if (wScrollTop > baseDistance) {
      return true;
    } else {
      return false;
    }
  },
  isTOBottom: function (tolerance, docElem, winElem, scrollElem) {
    var docH = docElem.outerHeight();
    var winH = winElem.outerHeight();
    var scrollH = scrollElem.scrollTop();
    var distance = winH + scrollH;
    var bottomH = docH - parseInt(tolerance);
    if (distance >= bottomH) {
      return true;
    }
    return false;
  },
  backTo: function (distance, scrollWindow, delay) {
    var baseDistance = '';
    if (typeof distance === 'number') {
      baseDistance = distance;
    } else {
      baseDistance = distance.offset().top;
    }
    scrollWindow.animate({'scrollTop': baseDistance}, delay);
  },
  elemToggleClass_tag: function (target, toggleClass) {
    if (!target.hasClass(toggleClass)) {
      target.addClass(toggleClass).siblings('.' + toggleClass).removeClass(toggleClass);
    }
  },
  elemToggleClass: function (target, toggleClass) {
    if (!target.hasClass(toggleClass)) {
      target.addClass(toggleClass);
    } else {
      target.removeClass(toggleClass);
    }
  },
  stopPropagation: function (e) {
    e = window.event || e;
    if (document.all) { // 只有ie识别
      e.cancelBubble = true;
    } else {
      e.stopPropagation();
    }
  },
  // 打开应用或者跳转到应用宝产品网址
  openClient: function (downUrl, scheme) {
    var ua = navigator.userAgent.toLowerCase();
    var config = {
      scheme_IOS: scheme + '://',
      scheme_Adr: scheme + '://splash',
      download_url: downUrl,
      timeout: 2000
    };
    var startTime = Date.now();
    var ifr = document.createElement('iframe');
    ifr.src = ua.indexOf('os') > 0 ? config.scheme_IOS : config.scheme_Adr;
    downUrl = ua.indexOf('os') > 0 ? config.download_url : config.download_url;
    ifr.style.display = 'none';
    document.body.appendChild(ifr);
    var t = setTimeout(function () {
      var endTime = Date.now();
      if (!startTime || endTime - startTime < config.timeout + 200) {
        window.location = downUrl;
      } else {
      }
    }, config.timeout);
    window.onblur = function () {
      clearTimeout(t);
    };
  },
  imgLoad: function (src, callback) {
    var img = new Image();
    img.onload = function () {
      callback && callback();
      img = null;
    };
    img.src = src;
  },
  timeStamp: function (startTime, endTime, isSecound) {
    if (isSecound) {
      startTime = startTime * 1000;
      endTime = endTime * 1000;
    }
    startTime = new Date(startTime);

    var y, m, d, sh, eh, smin, emin, commonStr, startTimeStr, endTimeStr;
    y = startTime.getFullYear();
    m = startTime.getMonth() + 1;
    d = startTime.getDate();
    sh = startTime.getHours();
    smin = startTime.getMinutes();
    commonStr = y + '-' + m + '-' + d;
    startTimeStr = sh + ':' + smin;

    endTimeStr = '';
    if (endTime) {
      endTime = new Date(endTime);
      eh = endTime.getHours();
      emin = endTime.getMinutes();
      endTimeStr = '-' + eh + ':' + emin;
    }
    return commonStr + ' ' + startTimeStr + endTimeStr;
  },
  getUrlParameter: function (sParam, sPageURL, split) {
    var sURLVariables = sPageURL.split(split);
    for (var i = 0; i < sURLVariables.length; i++) {
      var sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] == sParam) {
        return sParameterName[1];
      }
    }
    return '';
  },
  selectUpDataOptions: function (data, callback) {
    var dtd = $.Deferred();
    var $target = data.target,
      isdisable = $target.hasClass('disable'),
      parent = $target.parents('.c-select'),
      isload = parent.attr('data-isload'),
      currentId = parent.find('.c-select-btn').attr('data-id'),
      type = parent.attr('data-type'),
      li = $target.parents('li'),
      Id = li.attr('data-id'),
      IdVal = $target.text(),
      defaultOpt = li.siblings('[data-default]');
    if (isdisable) {
      return;
    }
    if (type === 'multiple') {
      var isSelect = li.hasClass('active');
      var oldId = $.trim(data.dataElem.val()), html = '', oldIdVal = $.trim(data.dataElemVal.val());
      if (isSelect) {
        if (Id) {
          Id = $.grep(oldId.split(','), function (val) {
            return val !== Id;
          });
          if (Id.length === 0) {
            Id = '';
          } else {
            Id = Id.join(',');
          }
          IdVal = $.grep(oldIdVal.split(','), function (val) {
            return val !== IdVal;
          });

          if (IdVal.length === 0) {
            IdVal = '';
          } else {
            IdVal = IdVal.join(',');
          }
          IdVal = IdVal || '全部';
          if (!Id) {
            if (!defaultOpt.hasClass('active')) {
              defaultOpt.addClass('active');
            }
          }
        } else {
          return;
        }
      } else {

        if (Id) {
          if (defaultOpt.hasClass('active')) {
            defaultOpt.removeClass('active');
          }
          if (oldId) {
            var newArr = oldId.split(',');
            newArr.push(Id);
            Id = newArr.join(',');
            var newValArr = oldIdVal.split(',');
            newValArr.push(IdVal);
            IdVal = newValArr.join(',');
          }
        } else {
          li.siblings('li.active').removeClass('active');
        }
      }

      html = util.ellipsis(IdVal, 7) + '<span class="filter-option pull-left"></span>&nbsp;<span class="caret"></span>';
      li.toggleClass('active');
    } else {
      if (isdisable) {
        return;
      }
      html = $target.text();
      html += '<span class="filter-option pull-left"></span>&nbsp;<span class="caret"></span>';
    }

    parent.find('.c-select-btn').html(html).attr('data-id', Id);
    if (data.dataElem) {
      data.dataElem.val(Id);
    }
    if (data.dataElemVal) {
      data.dataElemVal.val(IdVal);
    }
    var paramArr = [];
    var args = [].slice.call(arguments, 2);
    paramArr.push(data);
    paramArr = args.length > 0 ? [].push.apply(paramArr, args) : paramArr;
    callback && callback.apply(null, paramArr);
    dtd.resolve({
      type: type || 'single',
      id: Id,
      idVal: IdVal
    });
    return dtd.promise();
  },
  selectTag: function (data, callback) {
    var target = data.target, id = target.attr('data-id'),
      dataElem = target.closest('.c-select-tag').find('.dataElem'),
      ids = $.trim(dataElem.val());
    if (id === 'null') {
      return;
    }
    if (ids) {
      ids = ids.split(',');
    }
    if (target.hasClass('active')) {
      ids = $.grep(ids, function (val) {
        return val !== id;
      });
      if (ids.length === 0) {
        ids = '';
      } else {
        ids = ids.join(',');
      }

    } else {
      if (ids) {
        ids.push(id);
        ids = ids.join(',');
      } else {
        ids = id;
      }
    }
    dataElem.val(ids);
    target.toggleClass('active');
    var paramArr = [];
    var args = [].slice.call(arguments, 2);
    paramArr.push(data);
    paramArr = args.length > 0 ? [].push.apply(paramArr, args) : paramArr;
    callback && callback.apply(null, paramArr);
  },
  laydate: {
    setPath: function (laydate) {
      laydate.path = 'http://file.kingbrother.com:8082/static/laydate/';
    },
    option: {}
  },
  robot: {
    request: function (param) {
      var dtd = $.Deferred();
      param.dtd = dtd;
      $.ajax({
        type: param.method || 'GET',
        url: param.url || '',
        dataType: param.dataType || 'json',
        data: param.data || '',
        async: typeof param.async === 'boolean' ? param.async : true,
        beforeSend: function () {
          typeof param.beforeSend === 'function' && param.beforeSend(param);
        },
        success: function (data) {
          typeof param.successInit === 'function' && param.successInit(data, param);
          if (!/^4.*/.test(data.code)) {
            typeof param.success === 'function' && param.success(data, param);
            dtd.resolve(data);
          } else {
            typeof param.error === 'function' && param.error(data, param);
          }
        },
        error: function (error) {
          typeof param.error === 'function' && param.error(error, param);
        }
      });
      return dtd.promise();
    },
    sendMsg: function (insertElem, param) {
      util.robot.request({
        url: util.variable.robot.url,
        data: param,
        insertElem: insertElem,
        success: util.robot.request_success,
        error: util.requestResult.request_error
      });
    },
    request_success: function (data, param) {
      var insertElem = param.insertElem;
      var dialogItem = '';
      dialogItem = '<div class="media robot">' +
        '<div class="media-left">' +
        '<img class="media-object" src="" alt="机器人">' +
        '</div>' +
        '<div class="media-body"><div class="cont">' +
        data.text +
        '</div></div>' +
        '</div>';
      insertElem.append(dialogItem);
      var wrapperElem = insertElem.closest('.panel-body');
      var wrapperH = wrapperElem.outerHeight();
      var contH = insertElem.outerHeight() + 30;
      var scrollH = contH > wrapperH ? contH - wrapperH : 0;
      wrapperElem.animate({'scrollTop': scrollH}, 200);
    }
  },
  setLinkHash: function (currentPath, param, val) {
    var path = '';
    if (/#/.test(currentPath)) {
      var reg = new RegExp(param);
      if (reg.test(currentPath)) {
        var regReplace = new RegExp('(' + param + '=)[^&]*');
        path = currentPath.replace(regReplace, '$1' + val);
      } else {
        path = currentPath + '&' + param + '=' + val;
      }
    } else {
      path = currentPath + '#' + param + '=' + val;
    }
    return path;
  },
  setLinkSearch: function (currentPath, param, val) {
    var path = '';
    if (/\?/.test(currentPath)) {
      var reg = new RegExp(param);
      if (reg.test(currentPath)) {
        var regReplace = new RegExp('(' + param + '=)[^&]*');
        path = currentPath.replace(regReplace, '$1' + val);
      } else {
        path = currentPath + '&' + param + '=' + val;
      }
    } else {
      path = currentPath + '?' + param + '=' + val;
    }
    return path;
  },
  basic: {
    navHeighLight: function () {
      var uri = $('#currentUri').val();
      if (uri) {
        var str = uri;
        var c = '/'; // 要计算的字符
        var regex = new RegExp(c, 'g'); // 使用g表示整个字符串都要匹配
        var result = str.match(regex);
        var count = !result ? 0 : result.length;
        if (count > 3) {
          uri = uri.substr(0, uri.lastIndexOf('/') + 1);
          $('#subNav').find('a[data-node=\'' + uri + '\']').closest('.panel[data-panel-wrapper]').children('.panel-heading').trigger('click');
        } else {
          $('#subNav').find('a[data-node=\'' + uri + '\']').closest('.panel[data-panel-wrapper]').children('.panel-heading').addClass('active');
        }
      } else {
        $('#subNav').find('a[data-node=\'/\']').closest('.panel[data-panel-wrapper]').children('.panel-heading').addClass('active');
      }
    },
    navFixed: function (contWrapper, navFlag) {
      var toNav = util.isSlideToElem(navFlag.outerHeight(), $(window));
      if (toNav) {
        if (!contWrapper.hasClass('active')) {
          contWrapper.addClass('active');
        }
      } else {
        if (contWrapper.hasClass('active')) {
          contWrapper.removeClass('active');
        }
      }
    },
    dialogFormSubmit: function (target) {
      if (!target.hasClass('disabled')) {
        target.addClass('disabled');
        var form = target.closest('.c-form');
        var formID = form.attr('id');
        var validateResult = $('#' + formID).validationEngine('validate');
        if (validateResult) {
          var dialog = $('.dialog-cont-hook');
          var inputElem = target.closest('.input-group').children('.form-control');
          var cont = inputElem.val();
          var dialogItem = '';
          dialogItem = '<div class="media user">' +
            '<div class="media-body"><div class="cont">' +
            cont +
            '</div></div>' +
            '<div class="media-right">' +
            '<img class="media-object" src="" alt="我">' +
            '</div>' +
            '</div>';
          dialog.append(dialogItem);
          inputElem.val('');
          util.robot.sendMsg(dialog, {
            'key': util.variable.robot.key,
            'info': cont,
            'userid': $('#userCode').val() ? $('#userCode').val() : ''
          });
        }
        target.removeClass('disabled');
      }
    },
    init: function () {
      var _this = this;
      if ($('.nav-flag')[0]) {
        _this.navFixed($('.g-wrap'), $('.nav-flag'));
        $(window).scroll(function () {
          _this.navFixed($('.g-wrap'), $('.nav-flag'));
        });
      }
      /* _this.navHeighLight(); */
      // 退出登录
      if ($('#exitAccount')[0]) {
        $('#exitAccount').on('click', function () {
          util.request({
            url: util.variable.ajaxUrl + '/loginOut',
            method: 'POST',
            contentType: 'application/json;charset=UTF-8',
            success: function (data) {
              if (data.code === '200') {
                window.location.href = '/';
              }
            },
            error: util.requestResult.request_error
          });
        });
      }
      var page = util.getUrlParameter('page', decodeURIComponent(window.location.search).substr(1), '&') || 1;
      if ($('.breadcrumb')[0]) {
        var prevDom = $('.breadcrumb').children('.active').prev('li').children('a');
        var currentPath = prevDom.attr('href');
        prevDom.attr('href', util.setLinkHash(currentPath, 'page', page));
      }
      if ($('.back-hook')[0]) {
        var backDom = $('.back-hook');
        backDom.attr('href', util.setLinkHash(currentPath, 'page', page));
      }
      // 搜索折叠
      if ($('.search-control-hook')[0]) {
        $('.search-control-hook').on('click', '.icon', function () {
          var target = $(this);
          var type = target.attr('data-type');
          var form = target.parent().siblings('.c-search-form');
          if (type === 'collapse') {
            if (target.hasClass('active')) {
              target.removeClass('active');
              form.find('.collapse-item').removeClass('on');
            } else {
              target.addClass('active');
              form.find('.collapse-item').addClass('on');
            }
          }
        });
      }
      // 表格搜索折叠
      if ($('.search-control-table-hook')[0]) {
        $('.search-control-table-hook').on('click', '.icon', function () {
          var target = $(this);
          var type = target.attr('data-type');
          var form = target.closest('.c-search-form');
          if (type === 'collapse') {
            if (target.hasClass('active')) {
              target.removeClass('active');
              form.find('.collapse-table-item').removeClass('on');
            } else {
              target.addClass('active');
              form.find('.collapse-table-item').addClass('on');
            }
          }
        });
      }
    }
  },
  dataTables: {
    variable: {
      base: {
        tabPageLen: 20
      },
      opt: {
        dom: '<\'table-filter\' f><\'table-main clearfix\'<\'table-wrapper\' t>><\'table-page clearfix\' ip>r',
        destroy: true,
        processing: false,
        lengthChange: false,
        autoWidth: false,
        scrollX: true,
        language: {
          paginate: {// 分页的样式内容。
            previous: '上一页',
            next: '下一页',
            first: '第一页',
            last: '最后'
          },
          processing: '处理中...',
          loadingRecords: '载入中...',
          search: '搜索',
          zeroRecords: '没有内容', // table tbody内容为空时，tbody的内容。
          // 下面三者构成了总体的左下角的内容。
          info: '总共_PAGES_ 页，显示第_START_ 到第 _END_ ，筛选之后得到 _TOTAL_ 条，初始_MAX_ 条 ', // 左下角的信息显示，大写的词为关键字。
          infoEmpty: '0条记录', // 筛选为空时左下角的显示。
          infoFiltered: '' // 筛选之后的左下角筛选提示，
        },
        pagingType: 'full_numbers', // 分页样式的类型,
        stripeClasses: ['odd', 'even'], // 为奇偶行加上样式，兼容不支持CSS伪类的场合
        renderer: 'bootstrap',
        serverSide: true // 启用服务器端分页
      }
    }
  },
  validationEngine: {
    setOpt: function () {
      if ($.validationEngine) {
        $.validationEngine.defaults.autoPositionUpdate = true;
        $.validationEngine.defaults.addPromptClass = 'c-form-validate-tip';
        $.validationEngine.defaults.promptPosition = 'topRight';
        $.validationEngine.defaults.maxErrorsPerField = 1;
      }
    }
  },
  plupload: {
    fileFiltered: function (uploader, files, limit) {
      console.log('fileFiltered...');
      console.log(files);
      if (limit) {
        var limitNum = limit.replace(/(^\d\.)/g, '');
        var fileSize = parseInt(files.size) / Math.pow(1000, 1);
        if (fileSize > limitNum) {
          alert('文件大小不能超过' + limit + '!');
          uploader.removeFile(uploader.files[0]);
          return;
        }
      }
    },
    filesAdded: function (uploader, files, reviewType) {
      // console.log("filesAdded...");
      // 如果队列中的文件多余一个，则删除之前的选择
      // while (uploader.files.length > 1) {
      //     uploader.removeFile(uploader.files[0]);
      // }

      var btn = $(uploader.getOption('browse_button'));
      // var picbox = btn.siblings(".uploaderInfo").find(".picbox");
      // var nameElem = btn.siblings(".uploaderInfo").find(".uploadFileNameSpan");
      if (reviewType === 1) {
        return util.plupload.fileGetSource(files, function (file, type, fileSrc) {
          var picbox = btn.siblings('.uploaderInfo').find('.picbox');
          var nameElem = btn.siblings('.uploaderInfo').find('.uploadFileNameSpan'), item;
          if (type == 'image') {
            picbox.show();
            nameElem.hide();
            var hasImg = picbox.find('img');
            // if (hasImg.length > 0) {
            //     picbox.find("img").attr("src", fileSrc);
            // } else {
            //     picbox.append('<img src="' + fileSrc + '" />');
            // }
            item = $('<div class="item"><img src="' + fileSrc + '" /><i class="fa fa-close delete"></i></div>');
            picbox.append(item);
            item.data('file', file);
            var img = new Image();
            img.onload = function () {
              item.append('<i class="size">图片尺寸: ' + img.width + '*' + img.height + '</i>');
              img = picbox = nameElem = null;
            };
            img.src = fileSrc;
          } else {
            picbox.hide();
            nameElem.show();
            item = $('<span class="item">' + file.name + '<i class="fa fa-close delete"></i></span>');
            nameElem.append(item);
            item.data('file', file);
            btn = picbox = nameElem = null;
          }
          //  else if(type == "video"){
          //  var domain = "http://qiniu.tech2real.com/";
          //  var vurl = domain + files[0].name;
          //  var video = document.createElement("video");
          //  video.setAttribute("style","display:none;");
          //  video.setAttribute("src",vurl);
          //  document.body.appendChild(video);
          //  debugger;
          //  }
        });
      } else if (reviewType === 1.2) {
        return util.plupload.fileGetSource(files, function (file, type, fileSrc) {
          var picbox = btn.siblings('.uploaderInfo').find('.picbox');
          var nameElem = btn.siblings('.uploaderInfo').find('.uploadFileNameSpan');
          if (type == 'image') {
            picbox.show();
            nameElem.hide();
            var hasImg = picbox.find('img');
            if (hasImg.length > 0) {
              picbox.find('img').attr('src', fileSrc);
            } else {
              picbox.append('<img src="' + fileSrc + '" />');
            }
            var img = new Image();
            img.onload = function () {
              var hasSize = picbox.find('.size');
              if (hasSize.length > 0) {
                picbox.find('.size').text('图片尺寸: ' + img.width + '*' + img.height);
              } else {
                picbox.append('<i class="size">图片尺寸: ' + img.width + '*' + img.height + '</i>');
              }
              img = picbox = nameElem = null;
            };
            img.src = fileSrc;
          } else {
            picbox.hide();
            nameElem.show();
            btn.siblings('.uploaderInfo').find('.uploadFileNameSpan').text(files[0].name);
            btn = picbox = nameElem = null;
          }
        });

      } else if (reviewType === 2) {
        return util.plupload.fileGetSource(files);
      }

    },
    uploadProgress: function (uploader, files, modal, isShow) {
      if (!isShow) {
        return;
      }
      var percent = files.percent;
      var progessBox = modal.find('.c-upload-progressbox');
      if (percent == 100) {
        progessBox.find('.c-upload--progress-percent').text('文件上传中，请稍后。。。');
      } else {
        progessBox.find('.c-upload--progress-percent').text('文件上传中 ' + percent + '%');
      }

      progessBox.find('.c-upload-progress-current').css('width', percent + '%');

      // $('#file-'+file.id+' .progress').css('width',file.percent + '%');
      // console.log($('#file-'+files.id+' .progress'));
      // $('.uploadFileNameSpan').html(file.percent);
      // $('#file-'+file.id+' .progress').css('width',file.percent + '%');
      // 控制进度条
    },
    error: function (uploader, errObject, callback) {
      util.alert_autoHide(errObject.message, 'alert-danger');
      console.log(errObject);
      var args = [].slice.call(arguments, 3);
      var paramArr = [];
      paramArr.push(uploader, errObject);
      paramArr = args.length > 0 ? [].push.apply(paramArr, args) : paramArr;
      callback && callback.apply(null, paramArr);
//            closeLoading();
//            layer.msg('上传文件失败,请稍后重试!');
    },
    uploadComplete: function (uploader, files, callback) {
      var paramArr = [];
      var args = [].slice.call(arguments, 3);
      paramArr.push(uploader, files);
      paramArr = args.length > 0 ? [].push.apply(paramArr, args) : paramArr;
      callback && callback.apply(null, paramArr);
    },
    UploadFile: function (uploader, files) {
    },
    removeFile: function (target, uploader, file) {
      var dtd = $.Deferred();
      target.closest('.item').remove();
      uploader.removeFile(file);
      dtd.resolve();
      return dtd.promise();
    },
    fileUploaded: function (uploader, files, responseObject, callback) {
      var res = $.parseJSON(responseObject.response);
      if (res.code === '200') {
        var path = res.result.path;
        var btn = $(uploader.getOption('browse_button'));
        btn.siblings('.uploaderInfo').find('.uploadFilePath').val(path);
        util.alert_autoHide(res.message, 'alert-success');
      } else {
        util.alert_autoHide(res.message, 'alert-danger');
      }
      var paramArr = [];
      var args = [].slice.call(arguments, 4);
      paramArr.push(uploader, files, res);
      paramArr = args.length > 0 ? [].push.apply(paramArr, args) : paramArr;
      callback && callback.apply(null, paramArr);
    },
    chunkUploaded: function (uploader, files, responseObject, callback) {
      var res = $.parseJSON(responseObject.response);
      var paramArr = [];
      var args = [].slice.call(arguments, 4);
      paramArr.push(uploader, files, res);
      paramArr = args.length > 0 ? [].push.apply(paramArr, args) : paramArr;
      callback && callback.apply(null, paramArr);
    },
    fileGetSource: function (files, callback) {
      var dtd = $.Deferred();
      var len = files.length;
      var filesArr = [];
      $.each(files, function (idx, val) {
        var file = val;
        var fileType = file.type.split('/')[0];
        if (!file || !/image\//.test(file.type)) {
          callback && callback(file, fileType, false);
        } else {
          if (file.type == 'image/gif') {
            var fr = new moxie.file.FileReader();
            fr.onload = function () {
              callback && callback(file, fileType, fr.result);
              fr && fr.destroy();
              fr = null;
            };
            fr.readAsDataURL(file.getSource());
          } else {
            var preloader = new moxie.image.Image();
            preloader.onload = function () {
              // preloader.downsize(100, 100); //压缩图片
              var imgsrc = preloader.type == 'image/jpeg' ? preloader.getAsDataURL('image/jpeg', 80) : preloader.getAsDataURL();
              callback && callback(file, fileType, imgsrc);
              preloader.destroy();
              preloader = null;
            };
            preloader.onerror = function (e) {
              console.log(e);
            };
            preloader.load(file.getSource());
          }
        }
        filesArr.push({
          type: fileType,
          file: file
        });
        if (idx === len - 1) {
          dtd.resolve(filesArr);
        }
      });
      return dtd.promise();

    },
    review: function (res, uploaderBtn, uploaderReviewBox, createDomFn) {
      var DOM = document.createDocumentFragment();
      var $this = this;
      $.each(res, function (idx, val) {
        var item = createDomFn(val.file);
        DOM.appendChild(item);
        $(item).data('file', val.file);
      });
      var uploadType = uploaderBtn.attr('data-upload-type');
      if (uploadType === 'single') {
        uploaderReviewBox.html('');
      }
      uploaderReviewBox.append(DOM);
      $this = null;
    }
  },
  formatDate: function (timeStamp, fmt) {
    if (!timeStamp) {
      return '';
    }
    var time = new Date(timeStamp);
    var y, m, d, h, min, second, milliSencond, result;
    y = time.getFullYear();
    m = time.getMonth() + 1;
    d = time.getDate();
    h = time.getHours();
    min = time.getMinutes();
    second = time.getSeconds();
    milliSencond = time.getMilliseconds();

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
    if (/(S+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, milliSencond);
    }
    return fmt;
  },
  formatMoney: function (str) {
    var pattern = str.match(/\.\d*/);
    if (pattern) {
      pattern = pattern[0];
      if (pattern.length > 4) {
        str = parseFloat(str).toFixed(3).toString();
      }
    }
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },
  uuid: function (len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;
    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
      // rfc4122, version 4 form
      var r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuid.join('');
  },
  ellipsis: function (str, limit) {
    if (str.length > limit) {
      str = str.substr(0, limit) + '...';
    }
    return str;
  }
};


module.exports = util;


