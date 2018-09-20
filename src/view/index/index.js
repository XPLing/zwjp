import 'components/common/styleChunk';
import 'components/common/scriptChunk';
import 'components/index/index.scss';
import * as util from 'js/util';

import(/* webpackChunkName: "dataTables" */ 'components/lib/dataTables/dataTablesChunk').then((res) => {
  $(() => {
    var dataTab = $('#dataTable');
    dataTab.data('selected', '');
    var dataTabOpt = $.extend({}, util.dataTables.variable.opt, {
      scrollY: 600,
      order: [[3, 'desc']],
      lengthMenu: [[20, 50, -1], [20, 50, 100]],
      displayStart: util.getUrlParameter('page', decodeURIComponent(window.location.hash).substr(1), '&') ? parseInt(util.getUrlParameter('page', decodeURIComponent(window.location.hash).substr(1), '&') - 1) * util.dataTables.variable.base.tabPageLen : 0,
      ajax: function (data, callback, settings) {
        // 封装请求参数
        var tableData = this.api();
        var param = modle.events.getFilter(data, tableData, $('#dataTable'));
        // ajax请求数据
        modle.ajax.loadData(param, $('#dataTable').find('tbody'), callback);
      },
      rowId: 'id',
      columns: [
        {
          'width': '42%',
          'class': 'hasFlag',
          'data': 'name',
          'render': function (data, type, row, meta) {
            var dom = '<span class="text">' + data + '</span>';
            if (row.isTop) {
              dom += '<i class="icon">置顶</i>';
            }
            return dom;
          }
        },
        {
          'width': '6%',
          'data': 'type',
          'render': function (data, type, row, meta) {
            var typeValue = '';
            switch (data) {
              case 1:
                typeValue = '技术文档';
                break;
              case 2:
                typeValue = '质量文档';
                break;
              case 3:
                typeValue = '交付文档';
                break;
              case 4:
                typeValue = '营销文档';
                break;
              case 5:
                typeValue = '资质荣誉';
                break;
              case 10:
                typeValue = '其他';
                break;
            }
            return typeValue;
          }
        },
        {
          'width': '10%',
          'data': 'labelNames',
          'render': function (data, type, row, meta) {
            return data || '-';
          }
        },
        {
          'width': '10%',
          'data': 'lastModifiedTime',
          'render': function (data, type, row, meta) {
            return util.formatDate(data, 'yyyy-MM-dd hh:mm:ss');
          }
        },
        {
          'width': '5%',
          'data': 'lastModifiedByName'
        },
        {
          'width': '8%',
          'data': 'size',
          'render': function (data, type, row) {
            return data ? (data / 1024 / 1024).toFixed(2) + 'MB' : 0;
          }
        },
        {
          'width': '19%',
          'data': null,
          'orderable': false,
          'defaultContent': '',
          'class': ' text-nowrap operate',
          'render': function (data, type, row, meta) {
            var salesOrder = row.salesOrder ? row.salesOrder : -1;
            var api = new $.fn.dataTable.Api(meta.settings),
              page = api.page() + 1;
            var path = row.path ? '/pdf/preview/' + row.path.replace('.', '_') : '';
            var downPath = row.path ? '/pdf/download/' + row.path.replace('.', '_') : '';
            var permissionsOpt = modle.common.variable.permissions;
            var PERMISSIONS = permissionsOpt.list ? permissionsOpt.list.substring(1, permissionsOpt.list.length - 1) : '';
            var hasDelete = PERMISSIONS.indexOf(permissionsOpt.deleted),
              hasDetail = PERMISSIONS.indexOf(permissionsOpt.detail),
              hasDownload = PERMISSIONS.indexOf(permissionsOpt.download),
              hasEdit = PERMISSIONS.indexOf(permissionsOpt.edit),
              dom = '';
            if (hasDetail > -1) {
              dom += '<a target="_blank" class="btn btn-success btn-xs" href="/web/main/infoDoc/docList/docList_detail?file=' + path + '&title=' + row.name + '">查看</a>';
            }
            if (hasDelete > -1) {
              dom += '<a class="btn btn-success btn-xs" data-id="' + row.id + '" data-operate="delete">删除</a>';
            }
            if (hasEdit > -1) {
              dom += '<a href="/web/main/infoDoc/docList/docList_edit?page=' + page + '&id=' + row.id + '&salesOrder=' + salesOrder + '" class="btn btn-success btn-xs">编辑</a>';
            }
            if (row.isAllowDownload === 1) {
              if (hasDownload > -1) {
                dom += '<a download="' + row.name + '" class="btn btn-success btn-xs" href="' + downPath + '">下载</a>';
              }
            }
            return dom;
          }
        }
      ],
      columnDefs: [
        {
          'targets': [-1],
          'orderable': false
        },
        {
          'targets': -1,
          'createdCell': function (cell, cellData, rowData, rowIndex, colIndex) {

          }
        }
      ],
      rowCallback: function (row, data, index) {
        var selectedId = $(this).data('selected');
        if (data.recId == selectedId) {
          $(row).addClass('info');
        }
      },
      initComplete: function (settings, json) {
        var api = this.api();
        var table = $(this);
        //  表格查询
        modle.events.setBtnLink(api.page() + 1);
      }
    });
    var dataTabData = dataTab.dataTable(dataTabOpt).api();
    dataTab.data('table', dataTabData);
    dataTab.find('tbody').on('click', 'tr', function () {
      var dataTab = $('#dataTable');
      var id = parseInt(this.id);
      var selectedArr = dataTab.data('selected');
      dataTab.data('selected', id);
      if (!$(this).hasClass('info')) {
        $(this).addClass('info').siblings('tr.info').removeClass('info');
      }
    });
    dataTab.on('page.dt', function (e, settings) {
      var api = new $.fn.dataTable.Api(settings),
        page = api.page() + 1;
      util.getUrlParameter('page', decodeURIComponent(window.location.hash).substr(1), '&');
      var hash = decodeURIComponent(window.location.hash).substr(1);
      window.location.hash = hash.replace(/(page=)[^&]*/, '$1' + page);
      modle.events.setBtnLink(api.page() + 1);
    });
    /* 删除 */

    dataTab.on('click', 'a[data-operate]', function (e) {
      var target = $(this), operate = target.attr('data-operate');
      if (operate === 'delete') {
        var confirmModal = $('#comfirmModal');
        confirmModal.find('.modal-body').text('确定删除该文件？');
        confirmModal.find('.comfirm-modal-confirm').attr('data-id', target.attr('data-id')).data('currentTarget', target);
        confirmModal.modal('show');
      }
    });
    $('.comfirm-modal-confirm').on('click', function () {
      var target = $(this), param = {};
      param.id = target.attr('data-id');
      modle.ajax.deleteTarget(param, target.data('currentTarget'));
      $('#' + target.closest('.modal').attr('id')).modal('hide');
    });

    $('.search-submit-btn').on('click', function () {
      var table = $(this).closest('.panel').find('.dataTables_scrollBody .c-table'),
        tabID = table.attr('id');
      var tableData = $('#' + tabID).data('table');
      tableData.ajax.reload();
    });
    $('.search-reset-btn').on('click', function () {
      var table = $(this).closest('.panel').find('.dataTables_scrollBody .c-table'),
        tabID = table.attr('id'),
        searchDom = $(this).closest('.c-search-form');
      var tableData = $('#' + tabID).data('table');
      searchDom.find('.c-select-menu li:first-child a').click();
      searchDom.find('input').val('');
      tableData.ajax.reload();
    });
  });

});


import(/* webpackChunkName: "laydate" */ 'components/lib/laydate/laydateChunk').then((laydate) => {
  $(() => {
    console.log(laydate);
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
    request_error: function (error, param) {
      console.log(error);
      var insertElem = param.insertElem, tableWrapper = insertElem.parents('.c-table-wrapper');
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
    loadData: function (param, insertElem, dataTableCallback) {
      return util.request({
        url: util.variable.ajaxUrl + '/listDocs',
        data: param,
        dataTableCallback: dataTableCallback,
        insertElem: insertElem,
        beforeSend: modle.events.request.request_success_beforeSend,
        success: modle.events.request.request_success_loadData,
        error: modle.common.request_error
      });
    },
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
    }
  },
  events: {
    request: {
      request_success_beforeSend: function (param) {
        var mesgElem = $('.c-message');
        if (!mesgElem.is(':hidden')) {
          mesgElem.hide();
        }
        var insertElem = param.insertElem;
        var tableWrapper = insertElem.parents('.c-table-wrapper');
        tableWrapper.find('.c-shadow-local-abs').addClass('active');
        // table.find('.tip-meg').addClass('active').children('td').text("加载中。。。");
      },
      request_successInit_loadData: function (data, param) {
        var insertElem = param.insertElem;
        var mesgElem = insertElem.closest('.c-message-local');
        mesgElem.hide();
      },
      request_success_loadData: function (data, param) {
        var result = data.result,
          dataTableCallback = param.dataTableCallback,
          insertElem = param.insertElem,
          tableDom = insertElem.parents('.c-table'),
          dtd = param.dtd;
        var tableWrapper = insertElem.parents('.c-table-wrapper');

        // console.log(result);
        // 封装返回数据
        var returnData = {};
        // returnData.draw = tableData.draw; // 这里直接自行返回了draw计数器,应该由后台返回
        returnData.recordsTotal = data.totalSize; // 返回数据全部记录
        returnData.recordsFiltered = data.totalSize; // 后台不实现过滤功能，每次查询均视作全部结果
        returnData.data = result;
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
      var lastModifiedByName = $.trim($('.search-lastModifiedByName-val').val());
      if (lastModifiedByName) {
        param.lastModifiedByName = lastModifiedByName;
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
      var urlPage = util.getUrlParameter('page', decodeURIComponent(window.location.hash).substr(1), '&');
      param.page = urlPage || tableData.page() + 1;
      return param;
    }
  }
};

$(document).ready(function () {
  // 页面ui初始化
  util.basic.init();
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



