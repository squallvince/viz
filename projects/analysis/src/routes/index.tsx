/*
 * @Author: Squall Sha
 * @Date: 2020-10-15 17:25:00
 * @Last Modified by: Squall Sha
 * @Last Modified time: 2020-11-23 11:37:32
 */

import SearchApp from 'pages/index';
import Olap from 'pages/olap';
import DashboardList from 'pages/dashboard';
import Dashboard from 'pages/dashboard/dashboard';

let prefix = '/';
if (process.env.mode !== 'independent') {
  prefix = '/analysis/';
}

const routes = [
  {
    path: `${prefix}`,
    exact: true,
    component: SearchApp as any
  },
  {
    path: `${prefix}olap`,
    exact: true,
    component: Olap as any,
  },
  {
    path: `${prefix}dashboard`,
    exact: true,
    component: DashboardList as any
  },
  {
    path: `${prefix}dashboard/create`,
    exact: true,
    component: Dashboard as any
  },
  {
    path: `${prefix}dashboard/detail`,
    exact: true,
    component: Dashboard as any
  },
  {
    path: `${prefix}dashboard/edit`,
    exact: true,
    component: Dashboard as any
  }
];

export default routes;
