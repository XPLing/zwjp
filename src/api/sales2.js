import jsonp from 'assets/js/jsonp';
import {commonParams, options, REQUEST} from './config';
import axios from './axios';

const debug = !/production/.test(process.env.NODE_ENV);


export function orderList(obj) {
  var url = debug ? '/api/bom/orderList' : `${REQUEST.url}/api/bom/orderList`;
  const data = Object.assign({}, commonParams, obj.params);
  return axios({
    url: url,
    method: 'get',
    params: data,
    other: obj.other
  }).then((res) => {
    return Promise.resolve({
      resData: res.data,
      config: obj
    });
  }).catch(err => {
    return Promise.reject({
      error: err,
      config: obj
    });
  });
}
export function customerOrderDailyTable(obj) {
  var url = debug ? '/api/safe/customerOrderDailyTable' : `${REQUEST.url}/api/safe/customerOrderDailyTable`;
  const data = Object.assign({}, commonParams, obj.params);
  return axios({
    url: url,
    method: 'get',
    params: data,
    other: obj.other
  }).then((res) => {
    return Promise.resolve({
      resData: res.data,
      config: obj
    });
  }).catch(err => {
    return Promise.reject({
      error: err,
      config: obj
    });
  });
}
export function salesList(obj) {
  var url = debug ? '/api/bom/pcbaOrderList' : `${REQUEST.url}/api/bom/pcbaOrderList`;
  const data = Object.assign({}, commonParams, obj.params);
  return axios({
    url: url,
    method: 'get',
    params: data,
    other: obj.other
  }).then((res) => {
    return Promise.resolve({
      resData: res.data,
      config: obj
    });
  }).catch(err => {
    return Promise.reject({
      error: err,
      config: obj
    });
  });
}
export function orderGroup(obj) {
  var url = debug ? '/api/bom/orderGroup' : `${REQUEST.url}/api/bom/orderGroup`;
  const data = Object.assign({}, commonParams, obj.params);
  return axios({
    url: url,
    method: 'get',
    params: data,
    other: obj.other
  }).then((res) => {
    return Promise.resolve({
      resData: res.data,
      config: obj
    });
  }).catch(err => {
    return Promise.reject({
      error: err,
      config: obj
    });
  });
}
export function orderStatistics(obj) {
  var url = debug ? '/api/bom/orderStatistics' : `${REQUEST.url}/api/bom/orderStatistics`;
  const data = Object.assign({}, commonParams, obj.params);
  return axios({
    url: url,
    method: 'get',
    params: data,
    other: obj.other
  }).then((res) => {
    return Promise.resolve({
      resData: res.data,
      config: obj
    });
  }).catch(err => {
    return Promise.reject({
      error: err,
      config: obj
    });
  });
}
export function inquiryStatistics(obj) {
  var url = debug ? '/api/bom/inquiryStatistics' : `${REQUEST.url}/api/bom/inquiryStatistics`;
  const data = Object.assign({}, commonParams, obj.params);
  return axios({
    url: url,
    method: 'get',
    params: data,
    other: obj.other
  }).then((res) => {
    return Promise.resolve({
      resData: res.data,
      config: obj
    });
  }).catch(err => {
    return Promise.reject({
      error: err,
      config: obj
    });
  });
}
