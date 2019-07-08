import jsonp from 'assets/js/jsonp';
import {commonParams, options, REQUEST} from './config';
import axios from './axios';

const debug = !/production/.test(process.env.NODE_ENV);


export function qtyBacklogTable(obj) {
  var url = debug ? '/api/deliver/qtyBacklogTable' : `${REQUEST.url}/api/deliver/qtyBacklogTable`;
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
export function dayShipmentGroup(obj) {
  var url = debug ? '/api/deliver/dayShipmentGroup' : `${REQUEST.url}/api/deliver/dayShipmentGroup`;
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
export function monthShipmentGroup(obj) {
  var url = debug ? '/api/deliver/monthShipmentGroup' : `${REQUEST.url}/api/deliver/monthShipmentGroup`;
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
export function dayShipmentRate(obj) {
  var url = debug ? '/api/deliver/dayShipmentRate' : `${REQUEST.url}/api/deliver/dayShipmentRate`;
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
export function flowRateChart(obj) {
  var url = debug ? '/api/deliver/flowRateChart' : `${REQUEST.url}/api/deliver/flowRateChart`;
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
export function burdenChart(obj) {
  var url = debug ? '/api/deliver/burdenChart' : `${REQUEST.url}/api/deliver/burdenChart`;
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
