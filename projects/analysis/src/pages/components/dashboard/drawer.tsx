import React, { useState } from 'react';
import { Drawer, Input } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
const { Search } = Input;

interface DrawerProps {
  title: string;
  visible: boolean;
  setVisible: any;
}
const listData = [
  {
    title: '10月份报表名称HJLKJK10月份报表名称HJLKJK10月份报表名称HJLKJK10月份报表名称',
    time: '2020-10-30 14:53'
  },
  {
    title: '10月份报表名称HJLKJK',
    time: '2020-10-30 14:53'
  },
  {
    title: '10月份报表名称HJLKJK',
    time: '2020-10-30 14:53'
  },
  {
    title: '10月份报表名称HJLKJK',
    time: '2020-10-30 14:53'
  },
  {
    title: '10月份报表名称HJLKJK',
    time: '2020-10-30 14:53'
  },
  {
    title: '10月份报表名称HJLKJK',
    time: '2020-10-30 14:53'
  },
  {
    title: '10月份报表名称HJLKJK',
    time: '2020-10-30 14:53'
  }
]
const DrawerSection = (props: DrawerProps) => {
  const { title, visible, setVisible } = props;
  const onSearch = (value: string) => console.log(value);
  return (
    <div className="dashboard-drawer">
      <Drawer
        title={title}
        placement="right"
        closable={true}
        onClose={() => setVisible(false)}
        visible={visible}
        style={{ top: '40px' }}
      >
        <Search placeholder="input search text" onSearch={onSearch} />
        <ul className="list">
          {
            listData.length && [...listData, ...listData, ...listData].map((d: { title: string, time: string }, index) => {
              return (
                <li className="list-item" key={index}>
                  <div className="item-icon">
                    <FileTextOutlined />
                  </div>
                  <div className="item-content">
                    <p className="item-title">{d.title}</p>
                    <p className="item-time">修改时间：{d.time}</p>
                  </div>
                </li>
              )
            })
          }

        </ul>
      </Drawer>
    </div>
  )
}

export default DrawerSection;