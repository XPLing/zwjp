/**
 * Created by XPL on 2018/3/21.
 */
var express = require('express');
var apiRouter = express.Router();
var axios = require('./axios');
var cancel;
let pending = []; //  声明一个数组用于存储每个ajax请求的取消函数和ajax标识
let CancelToken = axios.CancelToken;
let removePending = (config) => {
  for (let p in pending) {
    if (pending[p].u === config.url + '&' + config.method) { // 当当前请求在数组中存在时执行函数体
      pending[p].f(); //  执行取消操作
      pending.splice(p, 1); //  把这条记录从数组中移除
    }
  }
};
var config = require('../../config');

apiRouter.get('/webLoginByPhone', function (req, res) {
  var url = `http://localhost:8080/open/webLoginByPhone`;
  console.log(url);
  axios({
    method: 'get',
    url: url,
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }).catch((e) => {
    console.log(e);
  });
});


axios.interceptors.request.use(config => {
  removePending(config); // 在一个ajax发送前执行一下取消操作
  config.cancelToken = new CancelToken((c) => {
    // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
    pending.push({u: config.url + '&' + config.method, f: c});
  });
  return config;
}, error => {
  return Promise.reject(error);
});

module.exports = apiRouter;
