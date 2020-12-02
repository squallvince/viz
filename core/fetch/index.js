/*
 * @Author: Squall Sha
 * @Date: 2019-11-26 09:00:00
 */
/* eslint no-unused-vars: 0 */
import { isAdmin, getCurrentPortal, getCurrentVDC, isVdcManager } from '../utils/cache';
import { PORTAL } from '../constants/portals';
import * as cookie from '../utils/tools/cookie';

const LOGIN_URL = '/login';

const openNotification = (type, res) => {
  window.Notification[type]({
    message: res.errorCode,
    duration: 0
  });
};

// 判断是否登录态失效
const _when401 = (res) => {
  // 401
  const { errorCode } = res;
  if (errorCode === 'AuthFailure') {
    const currentUrl = window.location.href;
    window.prevHref = currentUrl;
    window.singleSpaNavigate('/login');
    return false;
  }
};

// 当用户无访问权限，跳转到403页面
const _when403 = (res) => {
  // 403 UnauthorizedOperation
  // openNotification('error', res);
  return false;
};

const checkStatus = (res) => {
  // 这里处理异常code
  // if (responseStatus.code === 200 && location.pathname !== LOGIN_URL) {
  //   window.prevHref = null;
  //   return res;
  // }
  // if (responseStatus.code === 200 && location.pathname === LOGIN_URL) {
  //   return res;
  // }
  // if (responseStatus.code === 401 && location.pathname !== LOGIN_URL) {
  //   // 处理401
  //   _when401(res);
  // }
  // if (responseStatus.code === 403 && location.pathname !== LOGIN_URL) {
  //   // 处理403
  //   _when403(res);
  // }
  // if (responseStatus.code && (responseStatus.code !== 200 && responseStatus.code !== 401)) {
  //   // window.singleSpaNavigate('/login');
  //   openNotification('error', res);
  // }
  // if (responseStatus.code && responseStatus.code !== 200) {
  //   throw res;
  // }
};

const checkResponse = (res, resolve, reject) => {
  if (res.code === '1100011' || res.code === '1300010') {
    reject(res);
    const redirectParams = {
      client_id: 'data_platform_viz',
      response_type: 'code',
      scope: 'all',
      redirect_uri: `${window.location.origin}${window.location.pathname}`
    };
    const authPath = '/oauth/authorize';
    const redirectUrl = `http://10.217.62.10:8090${authPath}?client_id=${redirectParams.client_id}&response_type=${redirectParams.response_type}&scope=${redirectParams.scope}&redirect_uri=${redirectParams.redirect_uri}`;
    location.href = redirectUrl;
  } else if(res.context) {
    const {
      context: { status, message },
      data
    } = res;
    if (status === 200) {
      resolve(data);
    }else {
      openNotification('error', message);
      reject({ status,message });
    }
  }else {
    resolve(res);
  }
};

const parseJSON = (response) => {
  return response.json();
};

const _fetch = (requestPromise, timeout = 60000) => {
  let timeoutAction = null;
  const timerPromise = new Promise((resolve, reject) => {
    timeoutAction = () => {
      reject(new Error('timeout'));
    };
  });
  setTimeout(() => {
    timeoutAction();
  }, timeout);
  return Promise.race([requestPromise, timerPromise]);
};

const setHeaders = (opts) => {
  opts.headers['Cache-Control'] = 'no-cache';
  return opts;
};

export default (url = '', data, type = 'GET', singleSpa = {}, timeOut) => {
  type = type.toUpperCase();

  const requestConfig = {
    credentials: 'include',
    method: type,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    mode: 'cors',
    cache: 'force-cache'
  };

  if (type === 'POST') {
    Object.defineProperty(requestConfig, 'body', {
      value: JSON.stringify(data)
    });
  }

  if (type === 'GET' && data) {
    const paramsArray = [];
    Object.keys(data).forEach(key => paramsArray.push(`${key}=${data[key]}`));
    if (url.search(/\?/) === -1) {
      url += `?${paramsArray.join('&')}`;
    } else {
      url += `&${paramsArray.join('&')}`;
    }
  }

  const opts = setHeaders(requestConfig);
  try {
    const defer = new Promise((resolve, reject) => {
      _fetch(fetch(url, opts), timeOut)
        .then(res => {
          if (res.status === 404) {
            reject(res.statusText);
          }
          return parseJSON(res);
        })
        // .then(res => {
        //   return checkStatus(res);
        // })
        .then(res => {
          checkResponse(res, resolve, reject);
        })
        .catch(error => {
          reject(error);
        });
    });
    return defer;
  } catch (error) {
    throw new Error(error);
  }
};
