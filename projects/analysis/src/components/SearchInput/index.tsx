/*
 * @Author: Squall Sha
 * @Date: 2020-10-28 11:26:12
 * @Last Modified by: Squall Sha
 * @Last Modified time: 2020-11-18 15:58:18
 */

import React, { FC, useState } from 'react';
import { Menu, Layout, Input, Dropdown, Button, Radio, DatePicker } from 'antd';
import { SearchOutlined, DownOutlined } from '@ant-design/icons';
import './index.less';

const { Search } = Input;
const { RangePicker } = DatePicker;

// const [selectedTime, setTime] = useState('All');

// interface Option {
//   value: string | number;
//   label?: React.ReactNode;
//   disabled?: boolean;
//   children?: Option[];
// }

interface timeInfo {
  [key: string]: Object;
}

const timeMaps: timeInfo = {
  realTime: {
    title: '实时：',
    option: {
      last5Min: '五分钟',
      last1Hour: '1小时',
      todayStart: '今日',
    },
  },
  history: {
    title: '历史：',
    option: {
      yesterday: '昨日',
      lastWeek: '上周',
      lastMonth: '上月',
      lastYear: '上一年',
    },
  },
  customTime: {
    title: '自定义时间：',
    type: 'RangePicker',
    option: {
      customTime: '选择时间',
    },
  },
  allTime: {
    title: '所有时间：',
    option: {
      allTime: '所有时间',
    },
  },
};

const SearchInput: FC = (props) => {
  const { callback } = props;
  const [TimeText, setTimeText] = useState('全部时间');
  const [timeType, setTimeType] = useState('allTime');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const inputSearch = (str: String) => {
    if (str) {
      const result = {
        querySql: str,
        timeType: timeType,
        startTime: startTime,
        endTime: endTime,
      };
      callback(result);
    }
  };

  const findRadioName = (key: string) => {
    let radioName = '';
    Object.keys(timeMaps).map((objKey) => {
      Object.keys(timeMaps[objKey]['option']).map((childrenKey) => {
        if (childrenKey === key) {
          radioName = timeMaps[objKey]['option'][childrenKey];
        }
      });
    });
    return radioName;
  };

  const radioChange = (e: Event) => {
    setTimeType(e.target.value);
    setTimeText(findRadioName(e.target.value));
  };

  const datePickerChange = (dates: any, dateStrings: Array) => {
    setStartTime(dateStrings[0]);
    setEndTime(dateStrings[1]);
  };

  const menu = (): React.ReactNode => (
    <Menu className="search-datepicker-menu">
      <Radio.Group onChange={radioChange}>
        {timeMaps &&
          Object.keys(timeMaps).map((key) => {
            return (
              <Menu.Item key={key}>
                <label className="radio-title">{timeMaps[key]['title']}</label>
                {timeMaps[key]['type'] &&
                  Object.keys(timeMaps[key]['option']).map((name) => {
                    return (
                      <>
                        <Radio value={name}>
                          {timeMaps[key]['option'][name]}
                        </Radio>{' '}
                        <RangePicker onChange={datePickerChange} />
                      </>
                    );
                  })}
                {timeMaps[key]['option'] &&
                  !Object.prototype.hasOwnProperty.call(
                    timeMaps[key],
                    'type'
                  ) &&
                  Object.keys(timeMaps[key]['option']).map((name) => {
                    return (
                      <Radio value={name}>
                        {timeMaps[key]['option'][name]}
                      </Radio>
                    );
                  })}
              </Menu.Item>
            );
          })}
      </Radio.Group>
    </Menu>
  );

  return (
    <Layout className="search-component">
      <Search
        placeholder="请输入查询内容"
        allowClear
        enterButton="搜索"
        prefix={<SearchOutlined className="site-form-item-icon" />}
        suffix={
          <Dropdown overlay={menu} trigger={['click']}>
            <Button className="time-control">
              {TimeText} <DownOutlined />
            </Button>
          </Dropdown>
        }
        onSearch={inputSearch}
      />
    </Layout>
  );
};

export default SearchInput;
