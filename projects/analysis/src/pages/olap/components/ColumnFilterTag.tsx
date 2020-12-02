import React from 'react';
import { Tag, Dropdown, Menu } from 'antd';
import {
  CaretDownOutlined,
  CheckOutlined
} from '@ant-design/icons';

import 'less/olap/ColumnFilterTag.less';

// const BG = {
//   row: '#FFD9AF',
//   column: '#D0E2FF',
//   Filter: '#A6CFBA'
// };

interface IColumnFilterTagProps {
  // color: 'row' | 'column' | 'Filter';
  text: string;
  column?: string;
  // type?: 'date' | 'number' | 'string' | 'filter';
  onSelected?: (info: IMenuItemClickInfo, column: string | undefined) => void;
  onClose?: (e: React.MouseEvent<HTMLElement>) => void;
}

interface IIColumnFilterTagState {
  selectedKey: React.Key;
}

interface IMenuItemClickInfo {
  key: React.Key;
  keyPath: React.Key[];
  item: React.ReactInstance;
  domEvent: React.MouseEvent<HTMLElement>;
}

export default class ColumnFilterTag extends React.Component<IColumnFilterTagProps, IIColumnFilterTagState> {

  //   AVG("avg","avg","平均值"),
  // COUNT("avg","count","计数"),
  // SUM("sum","sum","总计"),
  // FIRST("first","first","第一个值"),
  // LAST("last","last","最后一个值"),
  // MAX("max","max","最大值"),
  // MIN("min","min","最小值"),
  // STDDEV("stddev","stddev",""),
  // STDDEVSAMP("stddevSamp","stddev_samp",""),
  // VARPOP("varPop","var_pop",""),
  // VARSAMP("varSamp","var_samp","");
  get filterMenuData() {
    return [
      {
        key: 'avg',
        value: '平均值'
      },
      {
        key: 'count',
        value: '计数'
      },
      {
        key: 'sum',
        value: '总计'
      },
      {
        key: 'first',
        value: '第一个值'
      },
      {
        key: 'last',
        value: '最后一个值'
      },
      {
        key: 'max',
        value: '最大值'
      },
      {
        key: 'min',
        value: '最小值'
      }
    ];
  }

  get filterMenu() {
    return (
      <Menu
        multiple={false}
        onClick={this.menuItemClick}
      >
        {
          this.filterMenuData.map(item => {
            return (
              <Menu.Item key={item.key}>
                <div className="filterMenuItem">
                  <div className={`text ${this.state.selectedKey === item.key ? 'active' : null}`}>{item.value}</div>
                  {
                    this.state.selectedKey === item.key && <CheckOutlined style={{ fontSize: '12px' }} />
                  }
                </div>
              </Menu.Item>
            );
          })
        }
      </Menu>

    );
  }

  get selectedValue() {
    return this.filterMenuData.filter(item => this.state.selectedKey === item.key)[0]?.value || '';
  }

  constructor(props: IColumnFilterTagProps) {
    super(props);
    this.state = {
      selectedKey: 'sum'
    };
  }

  menuItemClick = (info: IMenuItemClickInfo) => {
    // console.log(info);
    const { column } = this.props;
    this.setState({
      selectedKey: info.key
    });
    if (this.props.onSelected) {
      this.props.onSelected(info, column);
    }
  }

  closeItem = (e: React.MouseEvent<HTMLElement>) => {
    if (this.props.onClose) {
      this.props.onClose(e);
    }
  }

  // visibleChange = (visible: boolean) => {
  //   console.log(visible);

  // }

  render() {
    const { text } = this.props;
    return (
      // <div>
      <Tag
        className="filterItem"
        closable={true}
        color="#D0E2FF"
        style={{ color: '#000' }}
        onClose={this.closeItem}
      >
        <Dropdown
          overlay={this.filterMenu}
          trigger={['click']}
        >
          <CaretDownOutlined
            className="filterItemArrow"
            style={{ color: '#000' }} />
        </Dropdown>
        {this.selectedValue}({text})
      </Tag>
      // </div>
    );
  }
}