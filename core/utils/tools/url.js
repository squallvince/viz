/*
 * @Author: Squall Sha
 * @Date: 2019-12-02 15:00:00
 */

/**
 * 将请求参数转为query params
 */

export const queryParams = (name) => {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
  const result = window.location.search.substr(1).match(reg);
  if (result !== null) {
    return unescape(result[2]);
  }
  return null;
};

/**
 * 获取指定path
 */
export const getPath = (num = 1) => {
  const _arr = window.location.pathname.split('/');
  let _str = '';
  _arr.forEach((item, index) => {
    if (index <= num) {
      _str = item;
    }
  });
  return _str;
};
