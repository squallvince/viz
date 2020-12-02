/*
 * @Author: Squall Sha
 * @Date: 2020-10-15 17:25:00
 * @Last Modified by: Squall Sha
 * @Last Modified time: 2020-10-21 14:43:23
 */

import SearchApp from 'pages/index';

let prefix = '/';
if (process.env.mode !== 'independent') {
  prefix = '/search/';
}

const routes = [
  {
    path: `${prefix}`,
    exact: true,
    component: SearchApp as any
  }
];

export default routes;
