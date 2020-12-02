/*
 * @Author: Squall Sha
 * @Date: 2020-06-05 10:44:43
 * @Last Modified by: Squall Sha
 * @Last Modified time: 2020-11-20 10:42:05
 */
import * as R from 'ramda';

const BindUrlRefresh = (commonFunc) => {
  window.addEventListener('load', commonFunc(), false);
  window.addEventListener('popstate', commonFunc(), false);
};

const GetLastPathName = (str) => {
  const pathComponents = R.split('/');
  const pathArray = R.tail(pathComponents(str));
  return pathArray[pathArray.length - 1];
};

export { BindUrlRefresh, GetLastPathName };
