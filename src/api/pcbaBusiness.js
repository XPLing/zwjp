import jsonp from 'assets/js/jsonp';
import {commonParams, options, REQUEST} from './config';
import axios from './axios';

const debug = process.env.NODE_ENV !== 'production';


export function orderList(obj) {
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
export function consignmentList(obj) {
  var url = debug ? '/api/bom/shipDtlList' : `${REQUEST.url}/api/bom/shipDtlList`;
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
export function orderStatistics (obj) {
  var url = debug ? '/api/bom/pcbaOrderStatistics' : `${REQUEST.url}/api/bom/pcbaOrderStatistics`;
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
export function shipDtlStatistics(obj) {
  var url = debug ? '/api/bom/shipDtlStatistics' : `${REQUEST.url}/api/bom/shipDtlStatistics`;
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
