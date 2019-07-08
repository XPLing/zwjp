import 'components/common/styleChunk';
import 'components/common/scriptChunk';
import './deliver.scss';
import * as util from 'js/util';
import * as API from 'api/deliver';
import {
  ERR_OK,
  ERR_OK_STR
} from 'api/config';

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
        var insertElem = config.other.insertElem,
          tableWrapper = insertElem.parents('.c-table-wrapper');
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
      return API.qtyBacklogTable({
        params,
        other: {
          beforeSend: modle.events.request.request_success_beforeSend,
          resCB: modle.events.request.request_successInit_loadData,
          insertElem: $('#inProductionTable')
        }
      });
    },
    rate (params) {
      return API.dayShipmentRate({
        params,
        other: {
          beforeSend: modle.events.request.request_success_beforeSend,
          resCB: modle.events.request.request_successInit_loadData,
          insertElem: $('#rateData')
        }
      });
    },
    load: function (insertElem, params, echarts) {
      return API.burdenChart({
        params,
        other: {
          beforeSend: modle.events.request.request_success_beforeSend_chart,
          resCB: modle.events.request.request_successInit_loadData,
          insertElem: insertElem,
          echarts: echarts
        }
      });
    },
    speed: function (insertElem, params, echarts) {
      return API.flowRateChart({
        params,
        other: {
          beforeSend: modle.events.request.request_success_beforeSend_chart,
          resCB: modle.events.request.request_successInit_loadData,
          insertElem: insertElem,
          echarts: echarts
        }
      });
    },
    pieChart: function (type, insertElem, params, echarts) {
      return API[type]({
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
        var formatData = [{
          data: data.name
        },
          {
            data: data.qty
          },
          {
            data: data.overDayQty
          },
          {
            data: data.overDayQtyRate
          }
        ];
        $.each(formatData, (index, val) => {
          var td = document.createElement('div'),
            className = 'td swiper-no-swiping';
          var thead = tabbleHeader.find('.th').eq(index),
            theadClass = thead.attr('class').match(/(w-\d+)\s?.*$/);
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
      },
      tabHead (data, insertDom) {
        var fragment = document.createDocumentFragment();
        $(fragment).append(`<div class='tr thead'></div>`);
        $.each(data, (index, val) => {
          var w = 'w-0';
          if (index === 0) {
            w = 'w-2';
          }
          $(fragment).children('.tr').append(`<div class="th ${w}">${val}</div>`);
        });
        return fragment;
      },
      tabBody (data, head) {
        var fragment = document.createDocumentFragment();
        $.each(data, (trIdx, trDate) => {
          $(fragment).append(`<div class='tr'></div>`);
          $.each(trDate, (tdIdx, tdDate) => {
            var thead = head.find('.th').eq(tdIdx), className = 'td',
              theadClass = thead.attr('class').match(/(w-\d+)\s?.*$/);
            var width = theadClass ? theadClass[1] : null;
            if (width) {
              className += ' ' + width;
            }
            $(fragment).children('.tr').eq(trIdx).append(`<div class="${className}">${tdDate}</div>`);
          });
        });

        return fragment;
      }
    },
    request: {
      request_success_beforeSend: function (config) {
        var mesgElem = $('.c-message');
        if (!mesgElem.is(':hidden')) {
          mesgElem.hide();
        }
        var insertElem = config.other.insertElem;
        var tableWrapper = insertElem.closest('.panel-body');
        tableWrapper.find('.c-shadow-local-abs').addClass('active');
        // table.find('.tip-meg').addClass('active').children('td').text("加载中。。。");
      },
      request_successInit_loadData: function (res) {
        var insertElem = res.config.other.insertElem;
        var tableWrapper = insertElem.closest('.panel-body');
        tableWrapper.find('.c-shadow-local-abs').removeClass('active');
      },
      request_success_list: function (res) {
        if (res.resData.code !== util.variable.requestState.ERR_OK) {
          return Promise.reject(res.resData);
        }
        var trData = res.resData.result,
          config = res.config.other;
        var insertElem = config.insertElem;
        insertElem.html('');
        var fragDom = document.createDocumentFragment();
        $.each(trData, (index, val) => {
          var item = modle.events.createDom.tableTr(val, insertElem);
          fragDom.appendChild(item);
        });
        insertElem.append(fragDom);
        modle.events.calculateSlideWrapperWidth(insertElem, null, '.table-cont');
      },
      request_success_rate: function (res) {
        if (res.resData.code !== util.variable.requestState.ERR_OK) {
          return Promise.reject(res.resData);
        }
        var config = res.config.other, resData = res.resData.result,
          insertElem = config.insertElem;
        var sameCompareClass = resData.dayShipmentSame < 0 ? 'decrease' : 'increase',
          ringCompareClass = resData.dayShipmentLast < 0 ? 'decrease' : 'increase';
        $('#sameCompare').html(resData.dayShipmentSame).closest('.data').addClass(sameCompareClass);
        $('#ringCompare').html(resData.dayShipmentLast).closest('.data').addClass(ringCompareClass);
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
        if (respone.resData.code !== util.variable.requestState.ERR_OK) {
          return Promise.reject(respone.resData);
        }
        var data = respone.resData,
          config = respone.config.other,
          insertElem = config.insertElem,
          res = data.result,
          echarts = config.echarts, seriesOpts = [];
        var instance = echarts.getInstanceByDom(insertElem[0]);
        /* if(hasInstance != undefined){
            hasInstance.clear();
            echarts.dispose(chart);
            // delete ChartItem;
            // chart.innerHTML="";
        } */
        var xdata = [], yData = [], yKeys = [];
        res.x = res.x.map((val, index) => {
          if (index % 2) {
            return res.x[index - 1] + '-' + val;
          }
        }).filter((val, index) => {
          return val;
        });
        Object.keys(res.y).forEach((val, index) => {
          var item = res.y[val];
          res.y[val] = item.map((val, index) => {
            if (index % 2) {
              let res = item[index - 1] + val;
              return /\./.test(res) ? res.toFixed(2) : res;
            }
          }).filter((val, index) => {
            return val !== undefined;
          });
        });
        console.log(res);
        if (res) {
          xdata = res.x;
          yData = res.y;
          yKeys = Object.keys(yData);
          yKeys.forEach((key) => {
            seriesOpts.push({
              data: yData[key]
            });
          });
          var tab = $('#dataTable'), tabHead = modle.events.createDom.tabHead(['时间', ...xdata]),
            tabBody = modle.events.createDom.tabBody(yKeys.map((val, index) => {
              return [val, ...yData[val]];
            }), $(tabHead));
          tab.find('.table-header').append(tabHead);
          tab.find('.table-cont').append(tabBody);
        }
        instance.setOption({
          xAxis: {
            type: 'category',
            data: xdata
          },
          series: seriesOpts
        });
        instance.hideLoading();
        instance.resize();

      },
      request_success_chart_load: function (respone) {
        if (respone.resData.code !== util.variable.requestState.ERR_OK) {
          return Promise.reject(respone.resData);
        }
        var data = respone.resData,
          config = respone.config.other,
          insertElem = config.insertElem,
          res = data.result,
          echarts = config.echarts, seriesOpts = [];
        var instance = echarts.getInstanceByDom(insertElem[0]);
        /* if(hasInstance != undefined){
            hasInstance.clear();
            echarts.dispose(chart);
            // delete ChartItem;
            // chart.innerHTML="";
        } */
        var xdata = [], yData = [], yKeys = [];
        if (res) {
          xdata = res.x;
          yData = res.y;
          yKeys = Object.keys(yData);
          yKeys.forEach((key) => {
            seriesOpts.push({
              type: 'bar',
              data: yData[key],
              name: key
            });
          });
        }
        instance.setOption({
          legend: {
            data: yKeys,
            left: 'right'
          },
          xAxis: {
            type: 'category',
            data: xdata
          },
          series: seriesOpts
        });
        instance.hideLoading();
        instance.resize();
      },
      request_success_pieChart: function (respone) {
        if (respone.resData.code !== util.variable.requestState.ERR_OK) {
          return Promise.reject(respone.resData);
        }
        var data = respone.resData,
          config = respone.config.other,
          insertElem = config.insertElem,
          res = data.result.group || data.result,
          echarts = config.echarts;
        var instance = echarts.getInstanceByDom(insertElem[0]);
        /* if(hasInstance != undefined){
            hasInstance.clear();
            echarts.dispose(chart);
            // delete ChartItem;
            // chart.innerHTML="";
        } */
        var legend = [];
        $.each(res, (index, val) => {
          legend.push({
            name: val.name,
            icon: 'circle'
          });
        });
        instance.setOption({
          legend: {
            data: legend
          },
          series: [{
            data: res
          }]
        });
        instance.hideLoading();
        instance.resize();
        return Promise.resolve(data);
      },
      request_success_beforeSend_chart: function (res) {
        var config = res.other,
          insertElem = config.insertElem,
          echarts = config.echarts;
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
      var param = {},
        tabDom = $(tableData.table().node()),
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
    calculateSlideWrapperWidth: function (insertElem, childrenName, contWrapperName) {
      var insertElemH = insertElem.outerHeight(),
        contWrapper = insertElem.closest(contWrapperName || '.swiper-container'),
        contWrapperH = contWrapper.outerHeight(),
        slides = insertElem.find(childrenName || '.swiper-slide'),
        slideH = slides.eq(0).children('.tr').outerHeight() + 1;
      var clientSlideNum = Math.ceil(contWrapperH / slideH);
      contWrapper.css('height', slides.length * slideH + 'px');
      return {
        clientSlideNum,
        width: slideH * clientSlideNum
      };
    }
  }
};

import(/* webpackChunkName: "deliver_echarts" */ 'echarts').then((echarts) => {

  var lineChartOption = {
    grid: {
      top: '35',
      left: '20',
      right: '20',
      bottom: '20',
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
  // 流速
  var speedDom = document.getElementById('speedChart'), speedChart = echarts.init(speedDom);
  var nowDate = util.formatDate(new Date(), 'yy年MM月dd日');
  var speedChartOption = $.extend({}, lineChartOption, {
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
      text: `流速区 ${nowDate}全天流速数据`,
      left: 'left'
    },
    legend: {
      data: ['PCB-DYW', 'PCB-XA', 'PCB-工程部'],
      left: 'right'
    },
    series: [
      {
        name: 'PCB-工程部',
        type: 'line',
        barWidth: '85%',
        data: []
      },
      {
        name: 'PCB-XA',
        type: 'line',
        data: []
      },
      {
        name: 'PCB-DYW',
        type: 'line',
        data: []
      }
    ]
  });
  speedChart.setOption(speedChartOption);
  modle.ajax.speed($(speedDom), {}, echarts).then((res) => {
    return modle.events.request.request_success_chart(res);
  }).catch((e) => {
    var error = e.error || e, config = e.config || null;
    modle.common.request_error(error, config);
  });

  var barChartOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    grid: {
      top: '35',
      left: '20',
      right: '20',
      bottom: '20',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: []
    },
    yAxis: {
      type: 'value'
    }
  };
  // 负荷
  var loadDom = document.getElementById('loadChart');
  var loadChart = echarts.init(loadDom);
  var loadChartOption = $.extend({}, barChartOption, {
    title: {
      text: `负荷区 未来15天产能与符合差`,
      left: 'left',
      textStyle: {}
    }
  });
  loadChart.setOption(loadChartOption);
  modle.ajax.load($(loadDom), {}, echarts).then((res) => {
    return modle.events.request.request_success_chart_load(res);
  }).catch((e) => {
    var error = e.error || e,
      config = e.config || null;
    modle.common.request_error(error, config);
  });
  var pieOption = {
    legend: {
      data: [],
      orient: 'vertical',
      right: 10,
      bottom: '0',
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 6,
      textStyle: {
        fontSize: 10
      }
    },
    grid: {
      left: 20,
      right: 10,
      containLabel: true
    }
  };

  // 当天出货量
  var shipmentDayDom = document.getElementById('shipmentDay');
  var shipmentDate = util.formatDate(new Date(), 'yyyy年MM月dd日');
  $(shipmentDayDom).closest('.panel').find('.panel-heading .panel-title').html(`${shipmentDate} 出货量`);
  var shipmentDayChart = echarts.init(shipmentDayDom);
  var shipmentDayChartOption = $.extend({}, pieOption, {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c}万元 ({d}%)'
    },
    series: [{
      name: '订单类型',
      type: 'pie',
      radius: '100%',
      center: ['25%', 'middle'],
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
    }]
  });
  shipmentDayChart.setOption(shipmentDayChartOption);
  modle.ajax.pieChart('dayShipmentGroup', $(shipmentDayDom), {
    range: 'ordertype'
  }, echarts).then((res) => {
    return modle.events.request.request_success_pieChart(res);
  }).catch((e) => {
    var error = e.error || e,
      config = e.config || null;
    modle.common.request_error(error, config);
  });
  // 当月出货量
  var shipmentMonthDom = document.getElementById('shipmentMonth');
  var shipmentMonthDate = util.formatDate(new Date(), 'yyyy年MM月');
  $(shipmentMonthDom).closest('.panel').find('.panel-heading .panel-title').html(`${shipmentMonthDate} 累计出货量`);
  var shipmentMonthChart = echarts.init(shipmentMonthDom);
  var shipmentMonthChartOption = $.extend({}, pieOption, {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c}万元 ({d}%)'
    },
    series: [{
      name: '订单结构',
      type: 'pie',
      radius: '100%',
      center: ['25%', 'middle'],
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
    }]
  });
  shipmentMonthChart.setOption(shipmentMonthChartOption);
  modle.ajax.pieChart('monthShipmentGroup', $(shipmentMonthDom), {
    range: 'orderproperties'
  }, echarts).then((res) => {
    return modle.events.request.request_success_pieChart(res);
  }).then(res => {
    var completeRate = `${res.result.completeRate}%`;
    $('#completeRate').find('.progress-bar').attr({
      'aria-valuenow': res.result.completeRate,
      'style': `width:${completeRate}`
    }).find('span').html(completeRate);
  }).catch((e) => {
    var error = e.error || e,
      config = e.config || null;
    modle.common.request_error(error, config);
  });

});

$(document).ready(function () {

  // 页面ui初始化
  util.basic.init();
  modle.ajax.list().then((res) => {
    return modle.events.request.request_success_list(res);
  }).catch(e => {
    var error = e.error || e,
      config = e.config || null;
    modle.common.request_error(error, config);
  });
  modle.ajax.rate().then((res) => {
    return modle.events.request.request_success_rate(res);
  }).catch(e => {
    var error = e.error || e,
      config = e.config || null;
    modle.common.request_error(error, config);
  });

});

