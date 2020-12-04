import React, { FC, useState } from 'react';
import { Drawer, Input, Button } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
const { Search } = Input;

interface DrawerProps {
  title: string;
  visible: boolean;
  setVisible: any;
}
const listData = [
  {
    id: 0,
    title: '10月份报表名称HJLKJK10月份报表名称HJLKJK10月份报表名称HJLKJK10月份报表名称',
    time: '2020-10-30 14:53'
  },
  {
    id: 1,
    title: '10月份报表名称HJLKJK',
    time: '2020-10-30 14:53'
  },
  {
    id: 2,
    title: '10月份报表名称HJLKJK',
    time: '2020-10-30 14:53'
  },
  {
    id: 3,
    title: '10月份报表名称HJLKJK',
    time: '2020-10-30 14:53'
  },
  {
    id: 4,
    title: '10月份报表名称HJLKJK',
    time: '2020-10-30 14:53'
  },
  {
    id: 5,
    title: '10月份报表名称HJLKJK',
    time: '2020-10-30 14:53'
  },
  {
    id: 6,
    title: '10月份报表名称HJLKJK',
    time: '2020-10-30 14:53'
  }
]
const DrawerSection = (props: DrawerProps) => {
  const { title, visible, setVisible } = props;
  const [itemList, setitemList] = useState(listData);
  const [currentIndex, setCurrentIndex ] = useState(0);
  const onSearch = (value: string) => console.log(value);

  let listItem = listData.length && itemList.map((d: { title: string, time: string, id: number }, index) => {
    const activeItem = d.id === currentIndex ? 'list-item item-active' : 'list-item'
    return (
      <li className={activeItem} key={index} onClick={() => setCurrentIndex(d.id)}>
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

  return (
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
        {listItem}
      </ul>
      <footer className="drawer-footer"><Button>确 定</Button></footer>
    </Drawer>
  )
}

export default DrawerSection;