import 'components/common/styleChunk';
import 'components/common/scriptChunk';
import 'swiper/dist/css/swiper.css';
import Swiper from 'swiper';
import './pcbaBusiness.scss';
import * as util from 'js/util';
import * as API from 'api/pcbaBusiness';
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
    request_error: function (error, config) {
      console.log(error);
      if (config) {
        var insertElem = config.other.insertElem, tableWrapper = insertElem.parents('.c-table-wrapper');
        tableWrapper.find('.c-shadow-local-abs').removeClass('active');
      }
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
    orderList (params) {
      return API.orderList({
        params,
        other: {
          concurrent: true,
          beforeSend: modle.events.request.request_success_beforeSend,
          resCB: modle.events.request.request_successInit_loadData,
          insertElem: $('#dataTable')
        }
      });
    },
    consignmentList (params) {
      return API.consignmentList({
        params,
        other: {
          concurrent: true,
          beforeSend: modle.events.request.request_success_beforeSend,
          resCB: modle.events.request.request_successInit_loadData,
          insertElem: $('#dataTableConsignment')
        }
      });
    },
    orderAmount: function (insertElem, params, echarts) {
      return API.orderStatistics({
        params,
        other: {
          concurrent: true,
          beforeSend: modle.events.request.request_success_beforeSend_chart,
          resCB: modle.events.request.request_successInit_loadData,
          insertElem: insertElem,
          echarts: echarts
        }
      });
    },
    consignmentAmount: function (insertElem, params, echarts) {
      return API.shipDtlStatistics({
        params,
        other: {
          concurrent: true,
          beforeSend: modle.events.request.request_success_beforeSend_chart,
          resCB: modle.events.request.request_successInit_loadData,
          insertElem: insertElem,
          echarts: echarts
        }
      });
    },
    pieChart: function (insertElem, params, echarts) {
      return API.inquiryGroup({
        params,
        other: {
          beforeSend: modle.events.request.request_success_beforeSend_chart,
          resCB: modle.events.request.request_successInit_loadData,
          insertElem: insertElem,
          echarts: echarts,
          concurrent: true
        }
      });
    }
  },
  events: {
    createDom: {
      orderTableTr (data, insertElem) {
        var item = document.createElement('div');
        var tr = document.createElement('div');
        item.setAttribute('class', 'swiper-slide');
        tr.setAttribute('class', 'tr');
        var tabbleHeader = insertElem.closest('.c-table-custom').find('.table-header .thead');

        var formatData = [
          {data: util.formatDate(data.orderDate, 'yy-MM-dd')},
          {data: data.custCode},
          {data: data.orderNo},
          // {data: data.salesRep},
          {data: data.fileName},
          {data: data.setQuantity}
          // {data: data.orderAmount ? Number(data.orderAmount).toFixed(2) : 0.00}
          // {data: data.remark || 0}
          // {data: data.ordertype}
        ];

        $.each(formatData, (index, val) => {
          var td = document.createElement('div'), className = 'td swiper-no-swiping';
          var thead = tabbleHeader.find('.th').eq(index), theadClass = thead.attr('class').match(/(w-\d+)\s?.*$/);
          var width = theadClass ? theadClass[1] : null;
          if (width) {
            className += ' ' + width;
          }

          if (index === 5) {
            className += ' bg-success';
          }
          td.setAttribute('class', className);
          td.innerHTML = val.data;
          tr.appendChild(td);
        });
        item.appendChild(tr);
        return item;
      },
      consignmentTableTr (data, insertElem) {
        var item = document.createElement('div');
        var tr = document.createElement('div');
        item.setAttribute('class', 'swiper-slide');
        tr.setAttribute('class', 'tr');
        var tabbleHeader = insertElem.closest('.c-table-custom').find('.table-header .thead');

        var formatData = [
          {data: util.formatDate(data.shipDate, 'yy-MM-dd')},
          {data: data.custCode},
          {data: data.orderNo},
          // {data: data.salesRep},
          {data: data.fileName},
          {data: data.totalShipQty}
          // {data: data.amountShip ? Number(data.amountShip).toFixed(2) : 0.00}
          // {data: data.remark || 0}
          // {data: data.ordertype}
        ];

        $.each(formatData, (index, val) => {
          var td = document.createElement('div'), className = 'td swiper-no-swiping';
          var thead = tabbleHeader.find('.th').eq(index), theadClass = thead.attr('class').match(/(w-\d+)\s?.*$/);
          var width = theadClass ? theadClass[1] : null;
          if (width) {
            className += ' ' + width;
          }
          if (index === 5) {
            className += ' bg-success';
          }
          td.setAttribute('class', className);
          td.innerHTML = val.data;
          tr.appendChild(td);
        });
        item.appendChild(tr);
        return item;
      }
    },
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
      request_success_orderList: function (res) {
        var trData = res.resData.result, config = res.config.other, trDataLen = trData.length;
        var insertElem = config.insertElem;
        insertElem.html('');
        var fragDom = document.createDocumentFragment();
        // trData = trData.slice(0, 2);
        // trDataLen = trData.length;
        if (trDataLen > 0) {
          $.each(trData, (index, val) => {
            var item = modle.events.createDom.orderTableTr(val, insertElem);
            fragDom.appendChild(item);
          });
          insertElem.append(fragDom);
          var clientSlideNum = modle.events.calculateSlide(insertElem);
          var swiperContainerDom = $('.swiper-container-order');
          var swiperOpt = {
            autoplay: {
              disableOnInteraction: false,
              delay: 2000 // 1秒切换一次
            },
            direction: 'vertical', // 垂直切换选项
            slidesPerView: 'auto',
            noSwiping: true
          };
          if (trDataLen > clientSlideNum) {
            swiperOpt.loop = true;
          }
          var orderSwiper = new Swiper('.swiper-container-order', swiperOpt);
          swiperContainerDom.data('swiper', orderSwiper);
        } else {
          insertElem.closest('.table-cont').hide().closest('.c-table-custom').find('.nothing').show();
        }
      },
      request_success_consignmentList: function (res) {
        var trData = res.resData.result, config = res.config.other, trDataLen = trData.length;
        var insertElem = config.insertElem;
        insertElem.html('');
        if (trDataLen > 0) {
          var fragDom = document.createDocumentFragment();
          $.each(trData, (index, val) => {
            var item = modle.events.createDom.consignmentTableTr(val, insertElem);
            fragDom.appendChild(item);
          });
          insertElem.append(fragDom);
          var clientSlideNum = modle.events.calculateSlide(insertElem);
          var swiperContainerDom = $('.swiper-container-consignment');
          var swiperOpt = {
            autoplay: {
              disableOnInteraction: false,
              delay: 2000 // 1秒切换一次
            },
            direction: 'vertical', // 垂直切换选项
            slidesPerView: 'auto',
            noSwiping: true
          };
          if (trDataLen > clientSlideNum) {
            swiperOpt.loop = true;
          }
          var consignmentSwiper = new Swiper('.swiper-container-consignment', swiperOpt);
          swiperContainerDom.data('swiper', consignmentSwiper);
        } else {
          insertElem.closest('.table-cont').hide().closest('.c-table-custom').find('.nothing').show();
        }
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
      },
      request_success_orderChart: function (respone) {
        var data = respone.resData, config = respone.config.other, insertElem = config.insertElem,
          res = data.result, echarts = config.echarts;
        var instance = echarts.getInstanceByDom(insertElem[0]);
        var xdata = res.x, branch = res.y.branch, total = res.y.all, modular = res.y.modular;
        /* if(hasInstance != undefined){
            hasInstance.clear();
            echarts.dispose(chart);
            // delete ChartItem;
            // chart.innerHTML="";
        } */
        instance.setOption({
          xAxis: {
            type: 'category',
            data: xdata
          },
          series: [
            {
              data: total
            },
            {
              data: branch
            },
            {
              data: modular
            }
          ]
        });
        $('#successfulRate').text(res.avgRate + '%');
        $('#quotePriceTime').text(res.avgTime + 'min');
        instance.hideLoading();
        instance.resize();
        insertElem.data('chart', instance);
      },
      request_success_consignmentAmountChart: function (respone) {
        var data = respone.resData, config = respone.config.other, insertElem = config.insertElem,
          res = data.result, echarts = config.echarts;
        var instance = echarts.getInstanceByDom(insertElem[0]);
        var xdata = res.x, branch = res.y.branch, total = res.y.all, modular = res.y.modular;
        /* if(hasInstance != undefined){
            hasInstance.clear();
            echarts.dispose(chart);
            // delete ChartItem;
            // chart.innerHTML="";
        } */
        instance.setOption({
          xAxis: {
            type: 'category',
            data: xdata
          },
          series: [
            {
              data: total
            },
            {
              data: branch
            },
            {
              data: modular
            }
          ]
        });
        $('#successfulRate').text(res.avgRate + '%');
        $('#quotePriceTime').text(res.avgTime + 'min');
        instance.hideLoading();
        instance.resize();
        insertElem.data('chart', instance);
      },
      request_success_pieChart: function (respone) {
        var data = respone.resData, config = respone.config.other, insertElem = config.insertElem,
          res = data.result, echarts = config.echarts;
        var instance = echarts.getInstanceByDom(insertElem[0]);
        /* if(hasInstance != undefined){
            hasInstance.clear();
            echarts.dispose(chart);
            // delete ChartItem;
            // chart.innerHTML="";
        } */
        var legend = [];
        $.each(res, (index, val) => {
          legend.push(val.name);
        });
        instance.setOption({
          legend: {
            data: legend
          },
          series: [
            {
              data: res
            }
          ]
        });
        instance.hideLoading();
        instance.resize();
      },
      request_success_beforeSend_chart: function (res) {
        var config = res.other, insertElem = config.insertElem, echarts = config.echarts;
        var instance = echarts.getInstanceByDom(insertElem[0]);
        instance.showLoading();
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
    },
    calculateSlide: function (insertElem) {
      var insertElemH = insertElem.outerHeight(),
        slideH = insertElem.find('.swiper-slide').eq(0).children('.tr').outerHeight() + 1, actualSlideNum = 0;
      var clientSlideNum = Math.floor(insertElemH / slideH);
      insertElem.closest('.swiper-container').css('height', slideH * clientSlideNum + 'px');
      return clientSlideNum;
    }
  }
};

import(/* webpackChunkName: "pcbabusiness_echarts" */ 'echarts').then((echarts) => {
  var currentMonth = '近15天';
  var chartOption = {
    grid: {
      top: 50,
      left: '1%',
      right: '1%',
      bottom: '2%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: []
    },
    yAxis: [
      {
        type: 'value'
      }
    ]
  };
  // 订单额
  var orderAmountDom = document.getElementById('orderAmount');
  var orderAmountChart = echarts.init(orderAmountDom);
  var orderAmountChartOption = $.extend({}, chartOption, {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    title: {
      show: false,
      text: currentMonth + '下单金额分布图',
      left: 0,
      top: 0
    },
    legend: {
      data: ['合计(万)', 'PCBA订单金额(万)', '模块订单金额(万)'],
      left: 'right'
    },
    series: [
      {
        name: '合计(万)',
        type: 'bar',
        barWidth: '40%',
        label: {
          normal: {
            fontSize: 14,
            show: true
          }
        },
        data: []
      },
      {
        name: 'PCBA订单金额(万)',
        type: 'line',
        label: {
          normal: {
            fontSize: 14,
            show: true
          }
        },
        data: []
      },
      {
        name: '模块订单金额(万)',
        type: 'line',
        label: {
          normal: {
            fontSize: 14,
            show: true
          }
        },
        data: []
      }
    ]
  });
  orderAmountChart.setOption(orderAmountChartOption);
  modle.ajax.orderAmount($(orderAmountDom), {}, echarts).then((res) => {
    modle.events.request.request_success_orderChart(res);
  }).catch((e) => {
    var error = e.error || e, config = e.config || null;
    modle.common.request_error(error, config);
  });
  var consignmentAmountDom = document.getElementById('consignmentAmount');
  var consignmentAmountChart = echarts.init(consignmentAmountDom);
  var consignmentAmountChartOption = $.extend({}, chartOption, {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    title: {
      show: false,
      text: currentMonth + '出货金额趋势',
      left: 0,
      top: 0
    },
    legend: {
      data: ['出货总产值(万)', '分公司出货金额(万)', '模块出货金额(万)'],
      left: 'right'
    },
    series: [
      {
        name: '出货总产值(万)',
        type: 'bar',
        barWidth: '40%',
        label: {
          normal: {
            fontSize: 14,
            show: true
          }
        },
        data: []
      },
      {
        name: '分公司出货金额(万)',
        type: 'line',
        label: {
          normal: {
            fontSize: 14,
            show: true
          }
        },
        data: []
      },
      {
        name: '模块出货金额(万)',
        type: 'line',
        label: {
          normal: {
            fontSize: 14,
            show: true
          }
        },
        data: []
      }
    ]
  });
  consignmentAmountChart.setOption(consignmentAmountChartOption);
  modle.ajax.consignmentAmount($(consignmentAmountDom), {}, echarts).then((res) => {
    modle.events.request.request_success_consignmentAmountChart(res);
  }).catch((e) => {
    var error = e.error || e, config = e.config || null;
    modle.common.request_error(error, config);
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
  modle.ajax.orderList({
    orderName: 'orderDate',
    orderRule: 'desc',
    pageSize: 5,
    page: 1
  }).then((res) => {
    modle.events.request.request_success_orderList(res);
  }).catch(e => {
    var error = e.error || e, config = e.config || null;
    modle.common.request_error(error, config);
  });
  modle.ajax.consignmentList({
    orderName: 'shipDate',
    orderRule: 'desc'
  }).then((res) => {
    modle.events.request.request_success_consignmentList(res);
  }).catch(e => {
    var error = e.error || e, config = e.config || null;
    modle.common.request_error(error, config);
  });
});



