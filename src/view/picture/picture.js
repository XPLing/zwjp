import 'components/common/styleChunk';
import 'components/common/scriptChunk';
import './picture.scss';
import * as util from 'js/util';
import * as API from 'api/picture';
import { ERR_OK, ERR_OK_STR } from 'api/config';

var modle = {
  common: {
    variable: {
      ajaxBaseUrl: '../'
    },
    alert_autoHide: function (msg, type) {
      var mesgElem = $('.c-message');
      mesgElem.show().find('.' + type).show().html('<strong>' + msg + '</strong>').siblings().hide();
      mesgElem.delay(3000).fadeOut();
    },
    request_error: function (error) {
      console.log(error);
      var insertElem = error.config && error.config.other.insertElem, tableWrapper = insertElem && insertElem.parents('.c-table-wrapper');
      tableWrapper && tableWrapper.find('.c-shadow-local-abs').removeClass('active');
      var mesgElem = $('.c-message');
      mesgElem.show().find('.alert-danger').show().html('<strong>' + error.message + '</strong>').siblings().hide();
    },
    request_error_local: function (error, param) {
      console.log(error);
      var insertElem = param.insertElem;
      var mesgElem = insertElem.closest('.c-message-local');
      mesgElem.show().find('.alert-danger').show().html('<strong>' + error.message + '</strong>').siblings().hide();
    }

  },
  ajax: {
    getPicture (params) {
      return API.getPicture({
        params,
        other: {
          beforeSend: modle.events.request.request_success_beforeSend,
          resCB: modle.events.request.request_successInit_loadData,
          insertElem: $('#picture')
        }
      });
    }
  },
  events: {
    request: {
      request_success_beforeSend: function (config) {
        var mesgElem = $('.c-message');
        if (!mesgElem.is(':hidden')) {
          mesgElem.hide();
        }
        var insertElem = config.other.insertElem;
        var tableWrapper = insertElem.parents('.c-table-wrapper');
        tableWrapper.find('.c-shadow-local-abs').addClass('active');
        // table.find('.tip-meg').addClass('active').children('td').text("加载中。。。");
      },
      request_successInit_loadData: function (res) {
        var insertElem = res.config.other.insertElem;
        var tableWrapper = insertElem.parents('.c-table-wrapper');
        tableWrapper.find('.c-shadow-local-abs').removeClass('active');
      },
      request_success_loadData: function (data) {
        var result = data.resData.result,
          insertElem = data.config.other.insertElem;
        if (data.resData.code == ERR_OK && result) {
          insertElem.attr('src', result.qiniudownUrl);
        } else {
          modle.common.alert_autoHide('图片不存在！', 'alert-danger');
        }
      }
    },
    setBtnLink: function (page) {
      var dom = $('.create-btn-hook');
      var currentPath = dom.attr('href');
      dom.attr('href', util.setLinkHash(currentPath, 'page', page));
    }
  }
};

$(document).ready(function () {
  // 页面ui初始化
  util.basic.init();
  var id = util.getUrlParameter('id', decodeURIComponent(window.location.search).substr(1), '&');
  if (id) {
    modle.ajax.getPicture({
      id
    }).then((res) => {
      modle.events.request.request_success_loadData(res);
    }).catch(e => {
      var error = e.error || e,
        config = e.config || null;
      modle.common.request_error(error, config);
    });
  }
});



