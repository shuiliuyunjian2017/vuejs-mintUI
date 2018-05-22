//to fixed promise undefined in IEs
import 'babel-polyfill';
//引用axios
import axios from 'axios';
//API接口地址配置
import urlConfig from './url.config.js';
import { objToStr } from '@/utils/index.js';

let dataType = 'application/x-www-form-urlencoded',
    defaultTimeout = 15 * 1000;//一般设为5秒

axios.defaults.timeout = defaultTimeout; //响应时间
axios.defaults.baseURL = urlConfig.baseApiUrl;
axios.defaults.headers.post['Content-Type'] = dataType;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
//允许请求头携带cookies 开发环境才配置可跨域请求 
axios.defaults.withCredentials = process.env.NODE_ENV === 'development' ? true : false;

//POST传参序列化(添加请求拦截器)
let requestInterceptSuc = function (config) {
  //序列化
  if(typeof config.data === 'object' && config.method  === 'post' && config.headers.post['Content-Type'] === dataType){
    config.data = objToStr(config.data, '=', '&', true);
  }
  //过滤空值
  if (config.headers.post['Content-Type'] === 'application/json') {
    for (var item in config.data) {
      //'IGNOREEMPTY'标识里的字段，不过滤空值
      if (config.data['IGNOREEMPTY'] && config.data['IGNOREEMPTY'].split(',').indexOf(item) !== -1) {
        continue;
      }
      //过滤
      if (config.data[item] === '' || config.data[item] === null || config.data[item] === undefined || item === 'IGNOREEMPTY') {
        delete config.data[item];
      }
    }
  }

  return config;
}
let requestInterceptErr = function (error) {
  console.log("错误的传参", 'requestFail', error);
  return Promise.reject(error);
};
//axios.interceptors.request.use(requestInterceptSuc, requestInterceptErr);

//返回状态判断(添加响应拦截器)
let responseInterceptSuc = function (res) {
  let resultCode = res.data.resultMap.resultCode; 

  //账号未登陆或会话超时
  if (resultCode === '300001') {
    //TODO弹登录窗口
    console.log('账号未登陆或会话超时');
    return Promise.reject(res.data.resultMap);
  }

  //其他不成功情况
  if (resultCode !== '000000') {
    return Promise.reject(res.data.resultMap);
  }
  return res;
};
var responseInterceptErr = function (error) {
  //console.log("网络异常", 'responseFail', error);
  if (error && error.response) {
    switch (error.response.status) {
      case 400:
        error.message = '错误请求'
        break;
      case 401:
        error.message = '未授权，请重新登录'
        break;
      case 403:
        error.message = '拒绝访问'
        break;
      case 404:
        error.message = '请求错误,未找到该资源'
        break;
      case 405:
        error.message = '请求方法未允许'
        break;
      case 408:
        error.message = '请求超时'
        break;
      case 500:
        error.message = '服务器端出错'
        break;
      case 501:
        error.message = '网络未实现'
        break;
      case 502:
        error.message = '网络错误'
        break;
      case 503:
        error.message = '服务不可用'
        break;
      case 504:
        error.message = '网络超时'
        break;
      case 505:
        error.message = 'http版本不支持该请求'
        break;
      default:
        error.message = `连接错误${error.response.status}`
    }
  } else {
    error.message = "连接到服务器失败"
  }
  return Promise.reject(error);
};
//axios.interceptors.response.use(responseInterceptSuc, responseInterceptErr);

//返回一个Promise(发送post请求)
//返回状态成功拦截后的reject处理
let rejectAfterResponseSuc = function (err, reject) {
  // 未登录拦截
  if(err.resultCode !== '300001'){
    if (err.resultCode === '300010' && err.message.indexOf('msg.record.modified.elsewhere') != -1){
      console.log('您的操作过于频繁！');
    } else {
      reject(err);
    }
  }
};
export default {
  get: function (url, params, timeout) {
    if (timeout === undefined) {
      timeout = defaultTimeout;
    }
    return new Promise(function(resolve, reject) {
      axios.get(url, {params:params}, {timeout: timeout})
        .then(function (response) {
          resolve(response.data);
        }, function (err) {
          rejectAfterResponseSuc(err, reject);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  },
  post: function (url, params, timeout) {
    if (timeout === undefined) {
      timeout = defaultTimeout;
    }
    return new Promise(function(resolve, reject) {
      axios.post(url, params, {timeout: timeout})
        .then(function (response) {
          resolve(response.data);
        }, function (err) {
          rejectAfterResponseSuc(err, reject);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  },
  //JSON格式
  postJson: function (url, params, timeout) {
    if (timeout === undefined) {
      timeout = defaultTimeout;
    }
    return new Promise(function(resolve, reject) {
      var inst = axios.create({
        headers: {
          post: {'Content-Type': 'application/json'}
        }
      });

      inst.interceptors.request.use(requestInterceptSuc, requestInterceptErr);
      inst.interceptors.response.use(responseInterceptSuc, responseInterceptErr);

      inst.post(url, params, {timeout: timeout})
      .then(function (response) {
        resolve(response.data);
      }, function (err) {
        rejectAfterResponseSuc(err, reject);
      })
      .catch(function (error) {
        reject(error);
      });

    });
  },
  //formData格式
  postFormData: function (url, params, timeout) {
    if (timeout === undefined) {
      timeout = defaultTimeout;
    }
    return new Promise(function(resolve, reject) {
      var inst = axios.create({
        headers: {
          post: {'Content-Type': 'multipart/form-data'}
        }
      });

      inst.interceptors.request.use(requestInterceptSuc, requestInterceptErr);
      inst.interceptors.response.use(responseInterceptSuc, responseInterceptErr);

      inst.post(url, params, {timeout: timeout})
      .then(function (response) {
        resolve(response.data);
      }, function (err) {
        rejectAfterResponseSuc(err, reject);
      })
      .catch(function (error) {
        reject(error);
      });

    });
  },
  originAxios: axios
};
