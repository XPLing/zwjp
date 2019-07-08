import 'components/common/styleChunk';
import 'components/common/scriptChunk';
import 'swiper/dist/css/swiper.css';
import Swiper from 'swiper';
import './sales.scss';
import * as util from 'js/util';
import * as API from 'api/sales';
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
    list (params, insertElem, chartInsertElem, chart) {
      return API.areaOrderDailyTable({
        params,
        other: {
          beforeSend: modle.events.request.request_success_beforeSend,
          resCB: modle.events.request.request_successInit_loadData,
          insertElem: insertElem,
          chartInsertElem,
          chart,
          concurrent: true
        }
      });
    },
    speed: function (insertElem, params, echarts) {
      return API.orderStatistics({
        params,
        other: {
          beforeSend: modle.events.request.request_success_beforeSend_chart,
          resCB: modle.events.request.request_successInit_loadData,
          insertElem: insertElem,
          echarts: echarts
        }
      });
    },
    load: function (insertElem, params, echarts) {
      return API.inquiryStatistics({
        params,
        other: {
          beforeSend: modle.events.request.request_success_beforeSend_chart,
          resCB: modle.events.request.request_successInit_loadData,
          insertElem: insertElem,
          echarts: echarts
        }
      });
    }
  },
  events: {
    createDom: {
      tableTr (data, insertElem, allData) {
        var item = document.createElement('div');
        var tr = document.createElement('div');
        item.setAttribute('class', 'swiper-slide');
        tr.setAttribute('class', 'tr');
        var tabbleHeader = insertElem.closest('.c-table-custom').find('.table-header .thead');
        var formatData = [
          {
            data: data.rank
          },
          {
            data: data.deptName
          },
          {
            data: data.dayOrderAmount
          },
          {
            data: data.weekOrderAmount
          },
          {
            data: data.monthOrderAmount
          },
          {
            data: data.paybackAmount
          },
          {
            data: data.aim
          },
          {
            data: data.aimCompleteRate ? Number(data.aimCompleteRate) : 0
          }
        ];
        $.each(formatData, (index, val) => {
          var td = document.createElement('div'),
            className = 'td swiper-no-swiping';
          var thead = tabbleHeader.find('.th').eq(index),
            theadClassList = thead.attr('class'),
            theadClass = theadClassList.match(/(w-\d+)\s?.*$/);
          var width = theadClass ? theadClass[1] : null;
          if (width) {
            className += ' ' + width;
          }
          td.setAttribute('class', className);
          if (index === formatData.length - 1) {
            td.innerHTML = '<div class="progress">' +
              '                      <div class="progress-bar progress-bar-striped" role="progressbar" aria-valuenow="' + val.data + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + val.data + '%;">' +
              '                        <span>' + val.data + '%</span>' +
              '                      </div>' +
              '                    </div>';
          } else {
            td.innerHTML = val.data;
          }

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
        var trData = res.resData.result.list,
          config = res.config.other;
        var insertElem = config.insertElem;
        insertElem.html('');

        modle.events.initTableHead(insertElem.closest('.c-table-custom').find('.table-header .thead').find('.th'), res.resData.result);

        var fragDom = document.createDocumentFragment();
        $.each(trData, (index, val) => {
          var item = modle.events.createDom.tableTr(val, insertElem, res.resData.result);
          fragDom.appendChild(item);
        });
        insertElem.append(fragDom);
        modle.events.calculateSlideWrapperWidth(insertElem, 5);
        modle.events.initChart(res.resData.result, config, 5);
      },
      request_success_salesList: function (res) {
        var trData = res.resData.result.list, trDataLen = trData.length,
          config = res.config.other;
        var insertElem = config.insertElem;
        insertElem.html('');
        modle.events.initTableHead(insertElem.closest('.c-table-custom').find('.table-header .thead').find('.th'), res.resData.result);
        var fragDom = document.createDocumentFragment();
        $.each(trData, (index, val) => {
          var item = modle.events.createDom.tableTr(val, insertElem, res.resData.result);
          fragDom.appendChild(item);
        });
        insertElem.append(fragDom);
        var clientSlideNum = modle.events.calculateSlide(insertElem, trDataLen);
        var swiperContainerDom = $('.swiper-container-sales');
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
        var salesSwiper = new Swiper('.swiper-container-sales', swiperOpt);
        swiperContainerDom.data('swiper', salesSwiper);

        modle.events.initChart(res.resData.result, config, 5);

      },
      request_success_chart: function (respone) {
        console.log(respone);
        var insertElem = respone.insertElem,
          echarts = respone.echarts;
        var instance = echarts.getInstanceByDom(insertElem[0]);
        // var xdata = res.x,
        //   yData = res.y.slice(0, 9);
        /* if(hasInstance != undefined){
            hasInstance.clear();
            echarts.dispose(chart);
            // delete ChartItem;
            // chart.innerHTML="";
        } */
        instance.setOption({
          xAxis: {
            type: 'category',
            data: respone.x
          },
          series: respone.y
        });
        instance.hideLoading();
        instance.resize();
      },
      request_success_chart_load: function (respone) {
        console.log(respone);
        var data = respone.resData,
          config = respone.config.other,
          insertElem = config.insertElem,
          res = data.result,
          echarts = config.echarts;
        var instance = echarts.getInstanceByDom(insertElem[0]);
        var xdata = res.x,
          yData = res.y.inquiry.slice(0, 5);
        /* if(hasInstance != undefined){
            hasInstance.clear();
            echarts.dispose(chart);
            // delete ChartItem;
            // chart.innerHTML="";
        } */
        instance.setOption({
          // xAxis: {
          //   type: 'category',
          //   data: xdata
          // },
          series: [
            {
              data: yData
            },
            {
              data: yData
            },
            {
              data: yData
            },
            {
              data: yData
            }
          ]
        });
        instance.hideLoading();
        instance.resize();
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
    calculateSlideWrapperWidth: function (insertElem, num) {
      var insertElemH = insertElem.outerHeight(),
        contWrapper = insertElem.closest('.table-cont'),
        contWrapperH = contWrapper.outerHeight(),
        slideH = insertElem.find('.swiper-slide').eq(0).children('.tr').outerHeight();
      var clientSlideNum = num || Math.ceil(contWrapperH / slideH);
      contWrapper.css('height', slideH * clientSlideNum + 'px');
      return {
        clientSlideNum,
        width: slideH * clientSlideNum
      };
    },
    calculateSlide: function (insertElem, dataLen) {
      var insertElemH = insertElem.outerHeight(),
        slideH = insertElem.find('.swiper-slide').eq(0).children('.tr')[0].getBoundingClientRect().height.toFixed(2),
        actualSlideNum = 0;
      var clientSlideNum = Math.floor(insertElemH / slideH);
      clientSlideNum = dataLen < clientSlideNum ? dataLen : clientSlideNum;
      var totalH = slideH * clientSlideNum;
      totalH += clientSlideNum - 1; // 加上border高度
      insertElem.closest('.swiper-container').css('height', totalH + 'px');
      return clientSlideNum;
    },
    getChartDate (data, legend, salesStack, xlimit) {
      var chartDataX = data.map((val, idx) => {
        let res = val.deptName;
        if (res.length > xlimit) {
          res = res.replace('销售部', '');
          res = res.slice(0, xlimit) + '\n' + res.slice(xlimit);
        }
        return res;
      });
      var chartDataY = [
        data.map((val, idx) => { return val.dayOrderAmount; }),
        data.map((val, idx) => { return val.weekOrderAmount; }),
        data.map((val, idx) => { return val.monthOrderAmount; }),
        data.map((val, idx) => { return val.aim; })
      ];
      var series = legend.map((val, index) => {
        return {
          name: val,
          type: 'bar',
          data: chartDataY[index],
          stack: salesStack
        };
      });
      var barChartOption = {
        // color: ['#3398DB'],
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
          left: '8%',
          right: '2%',
          bottom: '50'
        },
        legend: {
          data: legend,
          left: 'center'
        },
        yAxis: {
          type: 'value'
        }
      };
      return {
        series,
        chartDataX,
        chartOpts: barChartOption
      };
    },
    initChart (data, config, xlimit) {
      var legend = ['当日销售额', `W${data.weekSort}实绩`, `${data.monthSort}月实绩`, `${data.monthSort}月目标`], salesStack = 'sales';
      var chartDate = modle.events.getChartDate(data.list, legend, salesStack, xlimit);
      // chart
      var chartDom = config.chartInsertElem,
        echarts = config.chart,
        chart = echarts.init(chartDom[0]);
      modle.events.initTableHead(chartDom.closest('.chunk-item').find('.statistic .item .name'), data, true);

      var chartOption = $.extend({}, chartDate.chartOpts, {
        xAxis: {
          type: 'category',
          data: chartDate.chartDataX,
          axisLabel: {
            rotate: 45,
            fontSize: 10
          }
        },
        series: chartDate.series
      });
      chart.setOption(chartOption);
    },
    initTableHead (dom, allDate, shouldTotal) {
      var total = modle.events.getTotal(allDate.list);
      dom.each((index, val) => {
        var item = $(val), theadClassList = item.attr('class');
        if (theadClassList.indexOf('dynamic-m') > -1) {
          item.html(item.html().replace(/^\d*(.*)$/, `${allDate.monthSort}$1`));

        } else if (theadClassList.indexOf('dynamic-w') > -1) {
          item.html(item.html().replace(/^\d*(.*)$/, `W${allDate.weekSort}$1`));
        }
        if (shouldTotal) {
          var parent = item.closest('.item'), key = parent.attr('class').replace(/item\s([\S]*)/, '$1'),
            result = total[key] || 0;
          parent.find('.data').html(key === 'completeRate' ? result + '%' : result);
        }

      });
    },
    getTotal (data) {
      var total = data.reduce((total, item) => {
        return {
          daySalesAmount: total.daySalesAmount + Number(item.dayOrderAmount),
          monthSalesAmount: total.monthSalesAmount + Number(item.monthOrderAmount),
          monthAim: total.monthAim + Number(item.aim),
          monthAmount: total.monthAmount + Number(item.paybackAmount),
          weekSalesAmount: total.weekSalesAmount + Number(item.weekOrderAmount),
          completeRate: total.completeRate + Number(item.completeRat)
        };
      }, {daySalesAmount: 0, monthSalesAmount: 0, monthAim: 0, monthAmount: 0, weekSalesAmount: 0, completeRate: 0});
      Object.keys(total).map((key) => {
        let item = total[key];
        if (/\.\d{2,}$/.test(item)) {
          total[key] = Number(item.toFixed(2));
        }
        return item;
      });
      return total;
    }
  }
};

$(document).ready(function () {
  import(/* webpackChunkName: "sales_echarts" */ 'echarts').then((echarts) => {

    modle.ajax.list({
      tabType: 'yxzx'
    }, $('#salesTable'), $('#salesChart'), echarts).then((res) => {
      modle.events.request.request_success_salesList(res);
    }).catch(e => {
      var error = e.error || e,
        config = e.config || null;
      modle.common.request_error(error, config);
    });
    modle.ajax.list({
      tabType: 'zwzx'
    }, $('#orderTable'), $('#idfmChart'), echarts).then((res) => {
      modle.events.request.request_success_list(res);
    }).catch(e => {
      var error = e.error || e,
        config = e.config || null;
      modle.common.request_error(error, config);
    });
  });
  // 页面ui初始化
  util.basic.init();

});

