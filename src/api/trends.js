import jsonp from 'assets/js/jsonp';
import {commonParams, options, REQUEST} from './config';
import axios from './axios';

const debug = !/production/.test(process.env.NODE_ENV);


export function list(obj) {
  var url = debug ? '/api/bom/inquiryList' : `${REQUEST.url}/api/bom/inquiryList`;
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
export function inquiryListStatistics(obj) {
  var url = debug ? '/api/bom/inquiryListStatistics' : `${REQUEST.url}/api/bom/inquiryListStatistics`;
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
export function inquiryChartStatistics(obj) {
  var url = debug ? '/api/bom/inquiryChartStatistics' : `${REQUEST.url}/api/bom/inquiryChartStatistics`;
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
export function inquiryGroup(obj) {
  var url = debug ? '/api/bom/inquiryGroup' : `${REQUEST.url}/api/bom/inquiryGroup`;
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
