/*
 * @Author: Squall Sha
 * @Date: 2020-11-26 14:51:00
 * @Last Modified by: Squall Sha
 * @Last Modified time: 2020-12-01 18:15:43
 */

import React, { FC, useState } from 'react';
import { Menu, Dropdown, Button } from 'antd';
import { CaretDownFilled, createFromIconfontCN } from '@ant-design/icons';
import DrawerSection from '../../components/dashboard/drawer';

const FormSelector: FC = ({ con, states, primary:data }) => {
  const [drawerFlag, setDrawer] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState('');
  // 未来使用
  const { primary } = states;
  const [primaryToken, setPrimaryToken] = primary;
  console.log(primaryToken);
  const { title, icon, options } = con;
  const CurrentIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_286280_p0xquimyp3n.js'
  });

  const handleMenuClick = (obj: { key: string, title: string, disabled: boolean, type: string }) => {
    obj.type === 'create' ? (window as any).singleSpaNavigate(`${obj.key}`) : handleDrawer(`${obj.title}`);
  };
  const handleDrawer = (val: string) => {
    setDrawer(true);
    setDrawerTitle(val === '从报表中选择' ? '报表选择' : '仪表盘选择');
  }
  const renderMenu = (arr: object[]): React.ReactNode => {
    return (
      <Menu>
        {arr.length > 0 && (
          arr.map((opt: any) => (
            <Menu.Item key={opt.key} disabled={opt.disabled} onClick={() => handleMenuClick(opt)}>
              {opt.title}
            </Menu.Item>
          ))
        )}
      </Menu>
    )
  };
  return (
    <>
      <Dropdown overlay={renderMenu(options)} trigger={['click']}>
        <Button size="large">
          <CurrentIcon type={icon} /> {title} <CaretDownFilled />
        </Button>
      </Dropdown>
      {
        drawerFlag && <DrawerSection visible={drawerFlag} title={drawerTitle} setVisible={(flag: boolean) => setDrawer(flag)}></DrawerSection>
      }
    </>
  )
}
export default FormSelector;