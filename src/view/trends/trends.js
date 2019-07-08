import 'components/common/styleChunk';
import 'components/common/scriptChunk';
import Swiper from 'swiper';
import './trends.scss';
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
    list (params) {
      return API.list({
        params,
        other: {
          beforeSend: modle.events.request.request_success_beforeSend,
          resCB: modle.events.request.request_successInit_loadData,
          insertElem: $('#dataTable')
        }
      });
    },
    inquiryListStatistics (params) {
      return API.inquiryListStatistics({
        params,
        other: {
          beforeSend: modle.events.request.request_success_beforeSend,
          resCB: modle.events.request.request_successInit_loadData,
          insertElem: $('#dataTable')
        }
      });
    },
    successfulChart: function (insertElem, params, echarts) {
      return API.inquiryStatistics({
        params,
        other: {
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
      tableTr (data, insertElem) {
        var item = document.createElement('div');
        var tr = document.createElement('div');
        item.setAttribute('class', 'swiper-slide');
        tr.setAttribute('class', 'tr');
        var tabbleHeader = insertElem.closest('.c-table-custom').find('.table-header .thead');

        var formatData = [
          {data: data.rfqNo},
          {data: data.productNo},
          {data: data.customerNo},
          {data: data.customerName},
          {data: util.formatDate(data.rfqDate, 'yy-MM-dd')},
          {data: data.qty || 0}
          // {data: data.ordertype}
        ];

        $.each(formatData, (index, val) => {
          var td = document.createElement('div'), className = 'td swiper-no-swiping';
          var thead = tabbleHeader.find('.th').eq(index), theadClass = thead.attr('class').match(/(w-\d+)\s?.*$/);
          var width = theadClass ? theadClass[1] : null;
          if (width) {
            className += ' ' + width;
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
      request_success_list: function (res) {
        var trData = res.resData.result, config = res.config.other;
        var insertElem = config.insertElem;
        insertElem.html('');
        var fragDom = document.createDocumentFragment();
        $.each(trData, (index, val) => {
          var item = modle.events.createDom.tableTr(val, insertElem);
          fragDom.appendChild(item);
        });
        insertElem.append(fragDom);
        var swiperOpt = {
          autoplay: {
            disableOnInteraction: false,
            delay: 2000 // 1秒切换一次
          },
          direction: 'vertical', // 垂直切换选项
          slidesPerView: 'auto',
          noSwiping: false
        };
        if (trData.length > 8) {
          swiperOpt.loop = true;
        }
        var mySwiper = new Swiper('.swiper-container', swiperOpt);
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
      request_success_chart: function (respone) {
        var data = respone.resData, config = respone.config.other, insertElem = config.insertElem,
          res = data.result, echarts = config.echarts;
        var instance = echarts.getInstanceByDom(insertElem[0]);
        var xdata = res.x, orderData = res.y.order, inquiryData = res.y.inquiry;
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
              data: inquiryData
            },
            {
              data: orderData
            }
          ]
        });
        $('#successfulRate').text(res.avgRate + '%');
        $('#quotePriceTime').text(res.avgTime + 'min');
        instance.hideLoading();
        instance.resize();
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
      },
      request_success_inquiryListStatistics: function (res) {
        var data = res.resData.result, config = res.config.other;
        var insertElem = config.insertElem;
        var today = $('#todayStatistic'), todayData = data.today;
        var month = $('#monthStatistic'), monthData = data.last30day;
        var sum = $('#sumStatistic'), allData = data.all;
        today.find('.count').text(todayData.num);
        today.find('.amount').text(todayData.amount);
        month.find('.count').text(monthData.num);
        month.find('.amount').text(monthData.amount);
        sum.find('.count').text(allData.num);
        sum.find('.amount').text(allData.amount);
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

import(/* webpackChunkName: "trends_echarts" */ 'echarts').then((echarts) => {
  var chartOption = {
    grid: {
      left: '0',
      right: '3%',
      bottom: '2%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['0-1', '1-5', '5-10', '10-20', '20-50', '≧50', '合计']
    },
    yAxis: [
      {
        type: 'value'
      }
    ]
  };
  // 订单额
  var successfulTradeDom = document.getElementById('successfulTrade');
  var successfulTradeChart = echarts.init(successfulTradeDom);
  var successfulTradeChartOption = $.extend({}, chartOption, {
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
      text: '询单成交趋势',
      left: 'center',
      top: 10
    },
    legend: {
      data: ['询单量', '下单量'],
      left: 'right'
    },
    series: [
      {
        name: '询单量(单)',
        type: 'line',
        barWidth: '85%',
        data: [400, 280, 300, 434, 300, 500, 420]
      },
      {
        name: '下单量(单)',
        type: 'line',
        data: [10, 30, 100, 20, 60, 150, 220]
      }
    ]
  });
  successfulTradeChart.setOption(successfulTradeChartOption);
  modle.ajax.successfulChart($(successfulTradeDom), {}, echarts).then((res) => {
    modle.events.request.request_success_chart(res);
  }).catch((e) => {
    var error = e.error || e, config = e.config || null;
    modle.common.request_error(error, config);
  });
  var pieOption = {
    legend: {
      data: [],
      orient: 'vertical',
      right: '2%',
      top: '20%',
      textStyle: {
        fontSize: 12
      }
    },
    grid: {
      left: '5%',
      right: '3%',
      containLabel: true
    }
  };
  // 询单类型
  var transactionTypeDom = document.getElementById('transactionType');
  var transactionTypeChart = echarts.init(transactionTypeDom);
  var transactionTypeChartOption = $.extend({}, pieOption, {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c}人次 ({d}%)'
    },
    series: [
      {
        name: '询单类型',
        type: 'pie',
        radius: '100%',
        center: ['30%', '50%'],
        label: {
          normal: {
            position: 'inner',
            formatter: '{d}%'
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        }
      }
    ]
  });
  transactionTypeChart.setOption(transactionTypeChartOption);
  modle.ajax.pieChart($(transactionTypeDom), {range: 'ordertype'}, echarts).then((res) => {
    modle.events.request.request_success_pieChart(res);
  }).catch((e) => {
    var error = e.error || e, config = e.config || null;
    modle.common.request_error(error, config);
  });
  // 询单结构
  var orderStructureDom = document.getElementById('orderStructure');
  var orderStructureChart = echarts.init(orderStructureDom);
  var orderStructureChartOption = $.extend({}, pieOption, {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c}人次 ({d}%)'
    },
    series: [
      {
        name: '询单结构',
        type: 'pie',
        radius: '100%',
        center: ['30%', '50%'],
        label: {
          normal: {
            position: 'inner',
            formatter: '{d}%'
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        }
      }
    ]
  });
  orderStructureChart.setOption(orderStructureChartOption);

  modle.ajax.pieChart($(orderStructureDom), {range: 'orderproperties'}, echarts).then((res) => {
    modle.events.request.request_success_pieChart(res);
  }).catch((e) => {
    var error = e.error || e, config = e.config || null;
    modle.common.request_error(error, config);
  });
  // 客户类型
  var consultationDom = document.getElementById('consultation');
  var consultationChart = echarts.init(consultationDom);
  var consultationChartOption = $.extend({}, pieOption, {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c}人次 ({d}%)'
    },
    series: [
      {
        name: '客户类型',
        type: 'pie',
        radius: '100%',
        center: ['22%', '50%'],
        label: {
          normal: {
            position: 'inner',
            formatter: '{d}%'
          }
        },
        labelLine: {
          normal: {
            show: false
          },
          emphasis: {
            show: true
          }
        }
      }
    ]
  });
  consultationChart.setOption(consultationChartOption);
  modle.ajax.pieChart($(consultationDom), {range: 'custlev'}, echarts).then((res) => {
    modle.events.request.request_success_pieChart(res);
  }).catch((e) => {
    var error = e.error || e, config = e.config || null;
    modle.common.request_error(error, config);
  });

});

import(/* webpackChunkName: "trends_laydate" */ 'components/lib/laydate/laydateChunk').then((laydate) => {
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

  modle.ajax.list({
    orderName: 'rfqDate',
    orderRule: 'desc'
  }).then((res) => {
    modle.events.request.request_success_list(res);
  }).catch(e => {
    var error = e.error || e, config = e.config || null;
    modle.common.request_error(error, config);
  });
  modle.ajax.inquiryListStatistics().then((res) => {
    modle.events.request.request_success_inquiryListStatistics(res);
  }).catch(e => {
    var error = e.error || e, config = e.config || null;
    modle.common.request_error(error, config);
  });
});



