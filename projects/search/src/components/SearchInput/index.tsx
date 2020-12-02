/*
 * @Author: Squall Sha
 * @Date: 2020-10-28 11:26:12
 * @Last Modified by: Squall Sha
 * @Last Modified time: 2020-11-19 14:54:26
 */

import React, { FC, useState } from 'react';
import { Layout, Input, Button, Modal } from 'antd';
import { SearchOutlined, AudioFilled } from '@ant-design/icons';
import './index.less';

const { Search } = Input;

const iatRecorder = new (window as any).Common360.Utils.IatRecorder();

const SearchInput: FC = (props) => {
  const { callback } = props;
  const [visibleAudio, setVisibleAudio] = useState(false);
  const [searchText, setSearchText] = useState('');

  // 监听识别结果的变化
  iatRecorder.onTextChange = (text: String) => {
    setSearchText(text);
  };

  // 状态改变时处理
  iatRecorder.onWillStatusChange = (oldStatus, status) => {
    // 可以在这里进行页面中一些交互逻辑处理：倒计时（听写只有60s）,录音的动画，按钮交互等
    let senconds = 0;
    let countInterval: any = null;
    if (status === 'ing') {
      // 倒计时相关
      countInterval = setInterval(()=>{
        senconds++;
        if (senconds >= 60) {
          audioAction();
          clearInterval(countInterval);
        }
      }, 1000);
    } else if (status !== 'init' || status !== 'ing') {
      clearInterval(countInterval);
    }
  };

  const inputSearch = (str: String) => {
    if (str) {
      const result = {
        querySql: str
      };
      document.querySelector('.page-init') && document.querySelector('.page-init')!.classList.remove('page-init');
      callback(result);
    }
  };

  const showAudio = () => {
    setVisibleAudio(!visibleAudio);
    if (iatRecorder.status === 'ing') {
      iatRecorder.stop();
    } else {
      iatRecorder.start();
    }
  };

  const audioAction = () => {
    iatRecorder.stop();
    setVisibleAudio(false);
    document.querySelector('.page-init') && document.querySelector('.page-init')!.classList.remove('page-init');
  };

  const setCurrentText = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <Layout className="search-component">
      <Search
        placeholder="请输入查询内容"
        allowClear
        enterButton="搜索"
        autoComplete="off"
        id="searchInput"
        prefix={<SearchOutlined className="site-form-item-icon" />}
        suffix={
          <>
            <Button className="audio-control" onClick={showAudio}>
              <AudioFilled />
            </Button>
            <Modal
              visible={visibleAudio}
              closable={false}
              footer={null}
              centered={true}
            >
              <>
                <Button className="white-btn" shape="circle" icon={<AudioFilled style={{color: '#5B7EE2'}} />} />
                <span className="audio-notice">想搜什么，说来听听！</span>
                <span className="audio-loading"><window.Common360.UI.loading /></span>
                <Button type="primary" onClick={audioAction}>结束识别</Button>
              </>
            </Modal>
          </>
        }
        onSearch={inputSearch}
        value={searchText}
        onChange={setCurrentText}
      />
    </Layout>
  );
};

export default SearchInput;
