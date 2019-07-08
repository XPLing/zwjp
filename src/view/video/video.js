import 'components/common/styleChunk';
import 'components/common/scriptChunk';
import './video.scss';
import * as util from 'js/util';
import * as API from 'api/trends';
import { ERR_OK, ERR_OK_STR } from 'api/config';

var modle = {
  common: {
    variable: {
      ajaxBaseUrl: '../',
      permissions: {
        list: $('#PERMISSIONS').val(),
        deleted: 'web:main:infoDoc:docList:delete',
        edit: 'web:main:infoDoc:docList:edit',
        download: 'web:main:infoDoc:docList:download',
        detail: 'web:main:infoDoc:docList:detail'
      }
    },
    alert_autoHide: function (msg, type) {
      var mesgElem = $('.c-message');
      mesgElem.show().find('.' + type).show().html('<strong>' + msg + '</strong>').siblings().hide();
      mesgElem.delay(3000).fadeOut();
    },
    request_error: function (error) {
      console.log(error);
      var insertElem = error.config.other.insertElem, tableWrapper = insertElem.parents('.c-table-wrapper');
      tableWrapper.find('.c-shadow-local-abs').removeClass('active');
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
    deleteTarget: function (param, insertElem) {
      return util.request({
        url: util.variable.ajaxUrl + '/delDoc',
        method: 'POST',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(param),
        insertElem: insertElem,
        beforeSend: modle.events.request.request_success_beforeSend,
        success: modle.events.request.request_success_delete,
        error: modle.common.request_error
      });
    },
    list (params) {
      return API.list({
        params,
        other: {
          beforeSend: modle.events.request.request_success_beforeSend,
          resCB: modle.events.request.request_successInit_loadData,
          insertElem: $('#dataTable')
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
      request_success_loadData: function (data, param) {
        var result = data.result,
          dataTableCallback = param.dataTableCallback,
          insertElem = param.insertElem,
          tableDom = insertElem.parents('.c-table');
        var tableWrapper = insertElem.parents('.c-table-wrapper');

        // console.log(result);
        // 封装返回数据
        var returnData = {}, totalSize = result.pageSize * result.pages;
        // returnData.draw = tableData.draw; // 这里直接自行返回了draw计数器,应该由后台返回
        returnData.recordsTotal = totalSize; // 返回数据全部记录
        returnData.recordsFiltered = totalSize; // 后台不实现过滤功能，每次查询均视作全部结果
        returnData.data = result.list;
        dataTableCallback(returnData);
        tableWrapper.find('.c-shadow-local-abs').removeClass('active');
        tableDom.attr('data-currentpage', data.currentPage);
      },
      request_success_delete: function (data, param) {
        var result = data.result,
          insertElem = param.insertElem,
          tableDom = insertElem.parents('.c-table'),
          dtd = param.dtd;
        var tableWrapper = insertElem.parents('.c-table-wrapper'),
          tabID = tableDom.attr('id');
        var tableData = $('#' + tabID).data('table');
        tableData.ajax.reload();
        tableWrapper.find('.c-shadow-local-abs').removeClass('active');
      }
    },
    setBtnLink: function (page) {
      var dom = $('.create-btn-hook');
      var currentPath = dom.attr('href');
      dom.attr('href', util.setLinkHash(currentPath, 'page', page));
    },
    getFilter: function (data, tableData, dataTab) {
      var param = {}, tabDom = $(tableData.table().node()),
        searchDom = tabDom.closest('.tab-pane').find('.search-wrapper');
      var name = $.trim($('.search-name-val').val());
      if (name) {
        param.name = name;
      }
      var labelNames = $.trim($('.search-labelNames-val').val());
      if (labelNames) {
        param.labelNames = labelNames;
      }
      var type = $.trim($('.search-type-val').val());
      if (type) {
        param.type = type;
      }
      var noFirst = dataTab.attr('nofirst');
      var filterTimeStart = $.trim($('#startTime').val());
      var filterTimeEnd = $.trim($('#endTime').val());
      if (!noFirst) {
        dataTab.attr('nofirst', true);
        filterTimeStart = $.trim($('#startTime').val()) || util.formatDate(new Date(new Date().getTime() - 3 * 30 * 24 * 3600 * 1000), 'yyyy-MM-dd');
        filterTimeEnd = $.trim($('#endTime').val()) || util.formatDate(new Date(), 'yyyy-MM-dd');
      }

      if (filterTimeStart && filterTimeEnd) {
        param.lastModifiedTimeStart = filterTimeStart;
        param.lastModifiedTimeEnd = filterTimeEnd;
      }
      param.orderName = tableData.column(data.order[0].column).dataSrc();
      param.orderRule = data.order[0].dir;
      param.page = tableData.page() + 1;
      return param;
    }
  }
};

import(/* webpackChunkName: "video_laydate" */ 'components/lib/laydate/laydateChunk').then((laydate) => {
  $(() => {
    // 设置laydate css加载路径
    util.laydate.setPath(laydate);
    // laydate初始化
    var layOptStart = $.extend({}, util.laydate.option, {
      elem: '#startTime',
      max: new Date().getTime(),
      value: new Date(new Date().getTime() - 3 * 30 * 24 * 3600 * 1000),
      done: function (value, date, endDate) {
        if (!value) {
          return;
        }
        endTime.config.min = {
          year: date.year,
          month: date.month - 1,
          date: date.date,
          hours: date.hours,
          minutes: date.minutes,
          seconds: date.seconds
        };
      }
    });
    var layOptEnd = $.extend({}, util.laydate.option, {
      elem: '#endTime',
      max: new Date().getTime(),
      value: new Date(),
      done: function (value, date, endDate) {
        if (!value) {
          return;
        }
        startTime.config.max = {
          year: date.year,
          month: date.month - 1,
          date: date.date,
          hours: date.hours,
          minutes: date.minutes,
          seconds: date.seconds
        };
      }
    });
    var startTime = laydate.render(layOptStart);
    var endTime = laydate.render(layOptEnd);
  });
});

$(document).ready(function () {
  // 页面ui初始化
  util.basic.init();
  // 获取页面信息
  util.provide.getPageInfo().then((res) => {
    util.provide.events.request_success_loadData(res);
  }).catch(e => {
    var error = e.error || e, config = e.config || null;
    util.provide.events.request_error(error, config);
  });
  // 下拉框选择信息修改
  $('.c-select-menu').on('click', 'a', function () {
    var _this = $(this);
    var parent = _this.parents('.c-select');
    var dataElem = parent.find('.dataElem');
    var data = {
      dataElem: dataElem,
      target: _this
    };
    util.selectUpDataOptions(data);
  });
});



