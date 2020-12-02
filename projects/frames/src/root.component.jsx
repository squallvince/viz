/*
 * @Author: Squall Sha
 * @Date: 2020-02-21 16:04:55
 * @Last Modified by: Squall Sha
 * @Last Modified time: 2020-12-01 17:12:19
 */

import React from 'react';
import BasicLayout from './layout/BasicLayout';
import { Loading, IatRecorder } from './components';
import * as Tools from './utils';

window.Common360 = {
  UI: {
    loading: Loading
  },
  Utils: {
    IatRecorder,
    Tools
  }
};

class Frames extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      menus: []
    };
  }

  checkAuth() {
    const urlCode = window.UrlTools.queryParams('code');
    let params = null;
    if (urlCode) {
      params = {
        code: urlCode,
        service: `${window.location.origin}${window.location.pathname}`
      };
    }
    return window.PromiseFetch('/api/v1.0/user/current', params, 'get');
  }

  checkRouter() {
    const { history } = this.props;
    const currentLocation = history.location;
    if (currentLocation.pathname === '/') {
      window.singleSpaNavigate('/search');
    }
  }

  async getMenus() {
    await this.checkAuth();
    const params = {
      domain: 'shacong1',
      appCode: 'dataplatformviz'
    };
    return window.PromiseFetch('/resource/menu/query', params, 'get');
  }

  componentDidMount() {
    this.getMenus().then(res => {
      this.setState({
        menus: res.data
      }, () => {
        this.checkRouter();
      });
    });
  }

  render() {
    const { menus } = this.state;
    return (
      <BasicLayout {...this.props} menus={menus} />
    );
  }
}

export default Frames;
