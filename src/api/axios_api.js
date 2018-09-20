/**
 * Created by XPL on 2018/3/21.
 */
var express = require('express');
var apiRouter = express.Router();
var axios = require('./axios_modules');
var config = require('../../config');
var bodyParser = require('body-parser');
var queryString = require('querystring');
const urlencodedParser = bodyParser.urlencoded({extended: true});
const jsonParser = bodyParser.json();

/* 资讯 */
apiRouter.post('/listNewsCategories', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/listNewsCategories`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/listNewsArticlesByCategory', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/listNewsArticlesByCategory`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/listArticlesByClubGuids', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/listArticlesByClubGuids`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/listCommentsByTargetId', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/listCommentsByTargetId`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/getCommentById', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/getCommentById`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/listRepliesByCommentId', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/listRepliesByCommentId`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/getCommentById', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/getCommentById`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/addCommentV2', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/addCommentV2`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/addCommentReply', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/addCommentReply`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/likeCommentV2', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/likeCommentV2`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.get('/favoriteArticle', function (req, res) {
  var url = `${config.dev.apiproxy_open}/favoriteArticle`;
  axios({
    method: 'get',
    url: url,
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.get('/unfavoriteArticle', function (req, res) {
  var url = `${config.dev.apiproxy_open}/unfavoriteArticle`;
  axios({
    method: 'get',
    url: url,
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.get('/likeArticle', function (req, res) {
  var url = `${config.dev.apiproxy_open}/likeArticle`;
  axios({
    method: 'get',
    url: url,
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.get('/unlikeArticle', function (req, res) {
  var url = `${config.dev.apiproxy_open}/unlikeArticle`;
  axios({
    method: 'get',
    url: url,
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.get('/viewArticle', function (req, res) {
  var url = `${config.dev.apiproxy_open}/viewArticle`;
  axios({
    method: 'get',
    url: url,
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.get('/getArticleById', function (req, res) {
  var url = `${config.dev.apiproxy_open}/getArticleById`;
  axios({
    method: 'get',
    url: url,
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.get('/getClubByClubGuid', function (req, res) {
  var url = `${config.dev.apiproxy_open}/getClubByClubGuid`;
  axios({
    method: 'get',
    url: url,
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.get('/listRecommendArticles', function (req, res) {
  var url = `${config.dev.apiproxy_open}/listRecommendArticles`;
  axios({
    method: 'get',
    url: url,
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.get('/listCourseValidityPeriodByCourseId', function (req, res) {
  var url = `${config.dev.apiproxy_open}/listCourseValidityPeriodByCourseId`;
  axios({
    method: 'get',
    url: url,
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});

/* 意见反馈 */
apiRouter.post('/addFeedback', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/addFeedback`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});

/* 培训 */
apiRouter.post('/getTagByTagId', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/getTagByTagId`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/listMyCourses', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/listMyCourses`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/getTrainHomeContainer', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/getTrainHomeContainer`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/listRecommendTeachers', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/listRecommendTeachers`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/listBannersByLocationType', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/listBannersByLocationType`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/listRecommendCourses', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/listRecommendCourses`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/listCoursesByTagId', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/listCoursesByTagId`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/listTagContainers', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/listTagContainers`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/listCoursesByTeacherId', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/listCoursesByTeacherId`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/getTeacherById', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/getTeacherById`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/listTeachers', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/listTeachers`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});

/* 课程详情 */
apiRouter.post('/getCourseById', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy_open}/getCourseById`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/listChaptersByCourseId', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/listChaptersByCourseId`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/applyCourse', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/applyCourse`;
  axios({
    method: 'post',
    url: url,
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/getCourseApplyByCourseId', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/getCourseApplyByCourseId`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/addEvaluate', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/addEvaluate`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/listEvaluatesByTargetId', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/listEvaluatesByTargetId`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});

/* 登录注册 */
apiRouter.get('/webLoginByPhone', function (req, res) {
  var url = `${config.dev.apiproxy_open}/webLoginByPhone`;
  axios({
    method: 'get',
    url: url,
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});

apiRouter.get('/registerByPhone', function (req, res) {
  var url = `${config.dev.apiproxy_open}/registerByPhone`;
  axios({
    method: 'get',
    url: url,
    headers: {
      host: 'https://open.dev.tech2real.com',
      referer: 'https://open.dev.tech2real.com/register_page'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});

apiRouter.get('/authRegisterByPhone', function (req, res) {
  var url = `${config.dev.apiproxy_open}/authRegisterByPhone`;
  axios({
    method: 'get',
    url: url,
    headers: {
      host: 'https://open.dev.tech2real.com',
      referer: 'https://open.dev.tech2real.com/register_page'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (error) => {
    res.json(error);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});

apiRouter.get('/boundMobileVerify', function (req, res) {
  var url = `${config.dev.apiproxy_open}/boundMobileVerify`;
  axios({
    method: 'get',
    url: url,
    headers: {
      host: 'https://open.dev.tech2real.com',
      referer: 'https://open.dev.tech2real.com/register_page'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (error) => {
    res.json(error);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});

apiRouter.get('/webRegisterAndBoundMobileByThirdPartUid', function (req, res) {
  var url = `${config.dev.apiproxy_open}/webRegisterAndBoundMobileByThirdPartUid`;
  axios({
    method: 'get',
    url: url,
    headers: {
      host: 'https://open.dev.tech2real.com',
      referer: 'https://open.dev.tech2real.com/register_page'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (error) => {
    res.json(error);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});

apiRouter.get('/webBoundMobileByThirdPartUid', function (req, res) {
  var url = `${config.dev.apiproxy_open}/webBoundMobileByThirdPartUid`;
  axios({
    method: 'get',
    url: url,
    headers: {
      host: 'https://open.dev.tech2real.com',
      referer: 'https://open.dev.tech2real.com/register_page'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (error) => {
    res.json(error);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.get('/getResetPwdAuthCode', function (req, res) {
  var url = `${config.dev.apiproxy_open}/getResetPwdAuthCode`;
  axios({
    method: 'get',
    url: url,
    headers: {
      host: 'https://open.dev.tech2real.com',
      referer: 'https://open.dev.tech2real.com/register_page'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (error) => {
    res.json(error);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.get('/resetPwdByAuthCode', function (req, res) {
  var url = `${config.dev.apiproxy_open}/resetPwdByAuthCode`;
  axios({
    method: 'get',
    url: url,
    headers: {
      host: 'https://open.dev.tech2real.com',
      referer: 'https://open.dev.tech2real.com/register_page'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (error) => {
    res.json(error);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.get('/webLoginByThirdPartCode', function (req, res) {
  var url = `${config.dev.apiproxy_open}/webLoginByThirdPartCode`;
  axios({
    method: 'get',
    url: url,
    headers: {
      host: 'https://open.dev.tech2real.com',
      referer: 'https://open.dev.tech2real.com/register_page'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (error) => {
    res.json(error);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/boundMobileByThirdPartUid', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/boundMobileByThirdPartUid`;
  axios({
    method: 'post',
    url: url,
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/unbindThirdParty', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/unbindThirdParty`;
  axios({
    method: 'post',
    url: url,
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});


/* 活动 */
apiRouter.get('/listDiscoverArticles', function (req, res) {
  var url = `${config.dev.apiproxy_open}/listDiscoverArticles`;
  axios({
    method: 'get',
    url: url,
    headers: {
      host: 'https://open.dev.tech2real.com',
      referer: 'https://open.dev.tech2real.com/register_page'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (error) => {
    res.json(error);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.get('/listDiscoverContent', function (req, res) {
  var url = `${config.dev.apiproxy_open}/listDiscoverContent`;
  axios({
    method: 'get',
    url: url,
    headers: {
      host: 'https://open.dev.tech2real.com',
      referer: 'https://open.dev.tech2real.com/register_page'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (error) => {
    res.json(error);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.get('/listDiscoverClubs', function (req, res) {
  var url = `${config.dev.apiproxy_open}/listDiscoverClubs`;
  axios({
    method: 'get',
    url: url,
    headers: {
      host: 'https://open.dev.tech2real.com',
      referer: 'https://open.dev.tech2real.com/register_page'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (error) => {
    res.json(error);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.get('/listDiscoverActivities', function (req, res) {
  var url = `${config.dev.apiproxy_open}/listDiscoverActivities`;
  axios({
    method: 'get',
    url: url,
    headers: {
      host: 'https://open.dev.tech2real.com',
      referer: 'https://open.dev.tech2real.com/register_page'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (error) => {
    res.json(error);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.get('/listDiscoverActivities', function (req, res) {
  var url = `${config.dev.apiproxy_open}/listDiscoverActivities`;
  axios({
    method: 'get',
    url: url,
    headers: {
      host: 'https://open.dev.tech2real.com',
      referer: 'https://open.dev.tech2real.com/register_page'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (error) => {
    res.json(error);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/listActivities', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/listActivities`;
  axios({
    method: 'post',
    url: url,
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/getActivityById', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/getActivityById`;
  axios({
    method: 'post',
    url: url,
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/applyActivity', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/applyActivity`;
  axios({
    method: 'post',
    url: url,
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/cancelActivityApply', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/cancelActivityApply`;
  axios({
    method: 'post',
    url: url,
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/getApplyByActivityId', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/getApplyByActivityId`;
  axios({
    method: 'post',
    url: url,
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});

/* 门票 */
apiRouter.post('/listTickets', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/listTickets`;
  axios({
    method: 'post',
    url: url,
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});

/* 报名 */
apiRouter.post('/listInfoCollectionsByGuid', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/listInfoCollectionsByGuid`;
  axios({
    method: 'post',
    url: url,
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/listMyClubs', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/listMyClubs`;
  axios({
    method: 'post',
    url: url,
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});

/* 社群 */
apiRouter.post('/listAllComments', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/listAllComments`;
  axios({
    method: 'post',
    url: url,
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/deleteCommentV2', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/deleteCommentV2`;
  axios({
    method: 'post',
    url: url,
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});




/* 俱乐部 */
apiRouter.post('/getClubByClubGuid', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/getClubByClubGuid`;
  axios({
    method: 'post',
    url: url,
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }).catch((e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/listArticlesByClubGuid', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/listArticlesByClubGuid`;
  axios({
    method: 'post',
    url: url,
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }).catch((e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/signPublicClubInView', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/signPublicClubInView`;
  axios({
    method: 'post',
    url: url,
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }).catch((e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/quitClub', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/quitClub`;
  axios({
    method: 'post',
    url: url,
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }).catch((e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/listClub', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/listClub`;
  axios({
    method: 'post',
    url: url,
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }).catch((e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/listMyClubs', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/listMyClubs`;
  axios({
    method: 'post',
    url: url,
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
/* 上传 */
apiRouter.post('/getFileCloudToken', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/getFileCloudToken`;
  axios({
    method: 'post',
    url: url,
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});


/* 我的 */
apiRouter.post('/getUserInfoByGuid', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/getUserInfoByGuid`;
  axios({
    method: 'post',
    url: url,
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/listFavoriteArticles', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/listFavoriteArticles`;
  axios({
    method: 'post',
    url: url,
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});

apiRouter.post('/listMyActivities', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/listMyActivities`;
  axios({
    method: 'post',
    url: url,
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/listMyClubComments', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/listMyClubComments`;
  axios({
    method: 'post',
    url: url,
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/listMyClubReplies', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/listMyClubReplies`;
  axios({
    method: 'post',
    url: url,
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/listNotifiesByType', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/listNotifiesByType`;
  axios({
    method: 'post',
    url: url,
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});

/* 账号 */
apiRouter.post('/getPrivileged', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/getPrivileged`;
  axios({
    method: 'post',
    url: url,
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/resetUserPassWord', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/resetUserPassWord`;
  axios({
    method: 'post',
    url: url,
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});


module.exports = apiRouter;
