import jsonp from 'assets/js/jsonp';
import {commonParams, options, REQUEST} from './config';
import axios from './axios';

const debug = process.env.NODE_ENV !== 'production';


export function list(obj) {
  var url = debug ? '/api/PcbLibrary/list' : `${REQUEST.url}/PcbLibrary/list`;
  const data = Object.assign({}, commonParams, obj.params);
  return axios({
    url: url,
    method: 'get',
    params: data,
    other: obj.other
  }).then((res) => {
    return Promise.resolve(res.data);
  }).catch(err => {
    err = Object.assign({}, err, {
      config: obj
    });
    return Promise.reject(err);
  });
}
