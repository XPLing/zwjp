import 'components/common/styleChunk';
import 'components/common/scriptChunk';
import 'swiper/dist/css/swiper.css';
import Swiper from 'swiper';
import './sales2.scss';
import * as util from 'js/util';
import * as API from 'api/sales2';
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
    list (params, url, insertElem) {
      return API[url]({
        params,
        other: {
          beforeSend: modle.events.request.request_success_beforeSend,
          resCB: modle.events.request.request_successInit_loadData,
          insertElem: insertElem
        }
      });
    },
    mainList (params) {
      return API.customerOrderDailyTable({
        params,
        other: {
          beforeSend: modle.events.request.request_success_beforeSend,
          resCB: modle.events.request.request_successInit_loadData,
          insertElem: $('#dataTable')
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
      tableTr (data, insertElem, color) {
        var item = document.createElement('div');
        var tr = document.createElement('div');
        item.setAttribute('class', 'swiper-slide');
        tr.setAttribute('class', 'tr');
        var tabbleHeader = insertElem.closest('.c-table-custom').find('.table-header .thead');
        var formatData = [
          {
            data: data.orderNo
          },
          {
            data: data.custCode
          },
          {
            data: data.abbrName
          },
          {
            data: data.fileName
          },
          {
            data: data.orderNo
          },
          {
            data: data.custCode
          },
          {
            data: data.abbrName
          },
          {
            data: 11.2
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
          if (index === formatData.length - 1) {
            td.innerHTML = '<div class="progress">' +
              '                      <div class="progress-bar progress-bar-striped ' + color + '" role="progressbar" aria-valuenow="' + val.data + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + val.data + '%;">' +
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
      },
      mainTableTr (data, insertElem) {
        var item = document.createElement('div');
        var tr = document.createElement('div');
        item.setAttribute('class', 'swiper-slide');
        tr.setAttribute('class', 'tr');
        var tabbleHeader = insertElem.closest('.c-table-custom').find('.table-header .thead');

        var formatData = [
          {data: data.custCode},
          {data: data.taxCode || ''},
          {data: data.totalAmount},
          {data: data.deliverOntimeRate},
          {data: data.customerComplaintRate},
          {data: data.payBackRate || 0}
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
        var trData = res.resData.result,
          config = res.config.other;
        var insertElem = config.insertElem;
        insertElem.html('');
        var fragDom = document.createDocumentFragment();
        $.each(trData, (index, val) => {
          var item = modle.events.createDom.tableTr(val, insertElem, 'org');
          fragDom.appendChild(item);
        });
        insertElem.append(fragDom);
        modle.events.calculateSlideWrapperWidth(insertElem, 5);
      },
      request_success_salesList: function (res) {
        var trData = res.resData.result,
          config = res.config.other;
        var insertElem = config.insertElem;
        insertElem.html('');
        var fragDom = document.createDocumentFragment();
        $.each(trData, (index, val) => {
          var item = modle.events.createDom.tableTr(val, insertElem, 'green');
          fragDom.appendChild(item);
        });
        insertElem.append(fragDom);
        modle.events.calculateSlideWrapperWidth(insertElem, 9);
      },
      request_success_mainList: function (res) {
        var trData = res.resData.result, config = res.config.other, trDataLen = trData.length;
        var insertElem = config.insertElem;
        insertElem.html('');
        var fragDom = document.createDocumentFragment();
        // trData = trData.slice(0, 2);
        // trDataLen = trData.length;
        if (trDataLen > 0) {

          $.each(trData, (index, val) => {
            var item = modle.events.createDom.mainTableTr(val, insertElem);
            fragDom.appendChild(item);
          });
          insertElem.append(fragDom);
          var clientSlideNum = modle.events.calculateSlide(insertElem, trDataLen);
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
          var orderSwiper = new Swiper('.swiper-container-main', swiperOpt);
          swiperContainerDom.data('swiper', orderSwiper);
        } else {
          insertElem.closest('.table-cont').hide().closest('.c-table-custom').find('.nothing').show();
        }

      }
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
    }
  }
};

$(document).ready(function () {

  // 页面ui初始化
  util.basic.init();
  modle.ajax.mainList().then((res) => {
    modle.events.request.request_success_mainList(res);
  }).catch(e => {
    var error = e.error || e,
      config = e.config || null;
    modle.common.request_error(error, config);
  });
  modle.ajax.list({
    orderName: 'orderDate',
    orderRule: 'desc'
  }, 'salesList', $('#salesTable')).then((res) => {
    modle.events.request.request_success_salesList(res);
  }).catch(e => {
    var error = e.error || e,
      config = e.config || null;
    modle.common.request_error(error, config);
  });
  modle.ajax.list({
    orderName: 'orderDate',
    orderRule: 'desc'
  }, 'orderList', $('#orderTable')).then((res) => {
    modle.events.request.request_success_list(res);
  }).catch(e => {
    var error = e.error || e,
      config = e.config || null;
    modle.common.request_error(error, config);
  });

});

