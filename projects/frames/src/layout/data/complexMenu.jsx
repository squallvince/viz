/*
 * @Author: Squall Sha
 * @Date: 2020-10-28 11:26:12
 * @Last Modified by: Squall Sha
 * @Last Modified time: 2020-11-09 17:11:24
 */

export default [
  {
    path: '/home',
    key: 'home',
    name: '首页',
    icon: 'icon-shoucang1'
  },
  {
    path: '/data-integration',
    key: 'data-integration',
    name: '数据集成',
    icon: 'icon-shoucang1',
    collapsed: false,
    children: [
      {
        menuName: '数据接入',
        key: 'data-access',
        name: '数据接入',
        path: '/data-access'
      },
      {
        menuName: '任务管理',
        key: 'task-management',
        name: '任务管理',
        path: '/task-management'
      }
    ]
  },
  {
    path: '/data-analysis',
    key: 'data-analysis',
    name: '数据分析',
    icon: 'icon-shoucang1',
    collapsed: false,
    children: [
      {
        path: '/analysis',
        key: 'analysis',
        name: '探索分析',
        hideInMenu: true
      },
      {
        path: '/multidimensional-analysis',
        key: 'multidimensional-analysis',
        name: '多维分析'
      },
      {
        path: '/report',
        key: 'report',
        name: '报表'
      },
      {
        path: '/dashboard',
        key: 'dashboard',
        name: '仪表盘'
      }
    ]
  },
  {
    path: '/search',
    key: 'enterprise-search',
    name: '企业级搜索',
    icon: 'icon-shoucang1',
    collapsed: false,
    children: [
      {
        path: '/search',
        key: 'search',
        name: '搜索'
      }
    ]
  }
];
