/*
 * @Author: Junqi Zhang
 * @Date: 2019-11-01 11:10:00
 * @Updater: Squall Sha
 * @UpdateTime: 2019-11-13 11:00:00
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import singleSpaReact from 'single-spa-react';
import RootComponent from './root.component';
import setPublicPath from './set-public-path';

const history = createBrowserHistory();

const appWithProvider = (spa) => {
  return (
    <Provider store={spa.store.storeInstance}>
      <RootComponent globalEventDistributor={spa.globalEventDistributor} history={history} />
    </Provider>
  );
};

const domElementGetter = () => {
  const el = document.querySelector('.root');
  return el;
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  // loadRootComponent: () => import('./root.component').then(property('default')),
  rootComponent: appWithProvider,
  // A boolean that indicates if single-spa-react should warn when the rootComponent does not implement componentDidCatch.
  suppressComponentDidCatchWarning: true,
  domElementGetter
});

export const bootstrap = [
  () => {
    return setPublicPath();
  },
  reactLifecycles.bootstrap
];

export function mount(props) {
  return reactLifecycles.mount(props);
}

export function unmount(props) {
  return reactLifecycles.unmount(props);
}
