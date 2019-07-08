import jsonp from 'assets/js/jsonp';
import {commonParams, options, REQUEST} from './config';
import axios from './axios';

const debug = !/production/.test(process.env.NODE_ENV);


export function getPicture(obj) {
  var url = debug ? '/dataAnalysis/picture/getById' : `${REQUEST.url}/dataAnalysis/picture/getById`;
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
