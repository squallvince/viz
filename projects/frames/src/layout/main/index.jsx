/*
 * @Author: Squall Sha
 * @Date: 2020-02-21 16:04:55
 * @Last Modified by: Squall Sha
 * @Last Modified time: 2020-10-29 15:05:05
 */

import React from 'react';
// import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import './index.less';

const { Content } = Layout;

const main = props => {
  const { className } = props;

  return (
    <Layout className={clsx('', className)}>
      <Content className="content-section" />
    </Layout>
  );
};

main.propTypes = {
  className: PropTypes.string
};

export default main;
