import React from 'react';
import { Tag, Dropdown, Menu, DatePicker, Space, Select, Input, message } from 'antd';
import {
  CaretDownOutlined,
  CheckOutlined,
  CheckSquareFilled
} from '@ant-design/icons';
// import { Moment } from 'moment';


import 'less/olap/SubFilterTag.less';
import { ITagItem } from '../Dimension';
import { IOlapQueryParams } from '../index';
import { getFilterStringOptions } from '../../../service/olap';

const { RangePicker } = DatePicker;
const { Option } = Select;

const dateStyle = {
  backgroundColor: '#25262D'
};

const dateSubmitStyle = {
  fontSize: '20px',
  color: '#5B7EE2',
  cursor: 'pointer'
};

// const dateFormat = 'YYYY-MM-DD';

// const BG = {
//   row: '#FFD9AF',
//   column: '#D0E2FF',
//   Filter: '#A6CFBA'
// };

interface ISubFilterTagProps {
  text: string;
  type?: string; // 'Date' | 'Number' | 'String' | 
  options?: Array<{ key: string, value: string }>;
  column?: string;
  querySchemas: ITagItem[];
  queryParams: IOlapQueryParams;
  onSelected?: (info: IMenuItemClickInfo) => void;
  onClose?: (e: React.MouseEvent<HTMLElement>) => void;
  onVisibleChange?: (prama: any) => void;
}

interface ISubFilterTagState {
  // stringSelectedKey: React.Key;
  visible: boolean;
  stringSelectedKeys: Array<React.Key>
  startTime: string | null;
  endTime: string | null;
  rangeSelectedFn: string;
  rangeResult: string;
  rangeResultInStart: string;
  rangeResultInEnd: string;
  stringFilterOptions: any;
}

interface IMenuItemClickInfo {
  key: React.Key;
  keyPath: React.Key[];
  item: React.ReactInstance;
  domEvent: React.MouseEvent<HTMLElement>;
}

export default class SubFilterTag extends React.Component<ISubFilterTagProps, ISubFilterTagState> {

  //   "moreThanThe","大于"
  // "lessThan","小于"
  // "beEqual","等于"
  // "greaterOrEqualTo","大于等于"
  // "lessThanOrEqualTo","小于等于"
  // "notEqual","不等于"
  // "in","包含"
  get rangeOptions() {
    return [
      {
        key: 'moreThanThe',
        value: '大于'
      },
      {
        key: 'lessThan',
        value: '小于'
      },
      {
        key: 'beEqual',
        value: '等于'
      },
      {
        key: 'greaterOrEqualTo',
        value: '大于等于'
      },
      {
        key: 'lessThanOrEqualTo',
        value: '小于等于'
      },
      {
        key: 'notEqual',
        value: '不等于'
      },
      {
        key: 'in',
        value: '包含'
      }
    ];
  }

  get filterMenu() {
    // const optionsLen = this.state.stringFilterOptions.length;
    // const hasMenu = this.state.stringFilterOptions?.length > 0 ? true : false;
    return (
      <Menu
        multiple={true}
        onClick={this.menuItemClick}
      >
        {
          this.state.stringFilterOptions.map((item: string) => {
            return (
              <Menu.Item key={item}>
                <div className="filterMenuItem">
                  <div title={item} className={`text ${this.state.stringSelectedKeys.includes(item) ? 'active' : ''}`}>{item}</div>
                  {
                    this.state.stringSelectedKeys.includes(item) && <CheckOutlined style={{ fontSize: '12px' }} />
                  }
                </div>
              </Menu.Item>
            );
          })
        }
      </Menu>

    );
  }

  get dateMenu() {
    return (
      <div className="datePicker">
        <Space>
          <RangePicker
            style={dateStyle}
            onChange={this.dateChange}
          />
          <CheckSquareFilled
            style={dateSubmitStyle}
            onClick={() => { this.dateSubmit(); }}
          />
        </Space>
      </div>
    );
  }

  get rangeMenu() {
    return (
      <div className="range">
        <Space>
          <Select
            value={this.state.rangeSelectedFn}
            style={{ width: 120 }}
            onChange={this.rangeSelectedChange}>
            {
              this.rangeOptions.map((item, i) => {
                return <Option key={i} value={item.key}>{item.value}</Option>;
              })
            }
          </Select>
          {
            this.state.rangeSelectedFn !== 'in' && <Input
              style={{ width: '220px' }}
              value={this.state.rangeResult}
              onChange={this.rangeInputChange}
            />
          }
          {
            this.state.rangeSelectedFn === 'in' && <React.Fragment>
              <Input
                style={{ width: '100px' }}
                value={this.state.rangeResultInStart}
                onChange={this.rangeInputInStartChange}
              />
            至
            <Input
                style={{ width: '100px' }}
                value={this.state.rangeResultInEnd}
                onChange={this.rangeInputInEndChange}
              />
            </React.Fragment>
          }
          <CheckSquareFilled
            style={dateSubmitStyle}
            onClick={() => { this.rangeSubmit(); }}
          />
        </Space>

      </div>
    );
  }

  constructor(props: ISubFilterTagProps) {
    super(props);
    this.state = {
      // stringSelectedKey: 'avg',
      visible: false,
      stringSelectedKeys: [],
      startTime: null,
      endTime: null,
      rangeSelectedFn: 'moreThanThe',
      rangeResult: '',
      rangeResultInEnd: '',
      rangeResultInStart: '',
      stringFilterOptions: []
    };
  }

  getSubFilterOptions = async () => {
    const { queryParams, querySchemas, text, type, column } = this.props;
    // console.log(queryParams, querySchemas);
    // console.log(text, type, column);

    try {
      const res = await getFilterStringOptions({
        ...queryParams,
        dataSchemaList: [...querySchemas],
        field: {
          fieldName: column,
          fieldShow: text,
          type: type
        }
      });
      // console.log(res);
      if (res) {
        this.setState({
          stringFilterOptions: res
        });
      } else {
        this.setState({
          stringFilterOptions: []
        });
      }
    } catch (error) {
      console.log(error);
      this.setState({
        stringFilterOptions: []
      });
      message.error('查询失败');
    }

  }

  componentDidMount() {
    document.addEventListener('click', () => {
      let { type } = this.props;
      if (type !== 'String') {
        return;
      }
      this.setState({
        visible: false
      });
    });
  }

  componentWillUnmount() {
    document.removeEventListener('click', () => {
      this.setState({
        visible: false
      });
    });
  }

  menuItemClick = (info: IMenuItemClickInfo) => {
    // console.log(info);
    info.domEvent.nativeEvent.stopImmediatePropagation();
    const stringSelectedKeys = this.state.stringSelectedKeys;
    const existedIndex = stringSelectedKeys.indexOf(info.key);
    if (existedIndex === -1) {
      stringSelectedKeys.push(info.key);
    } else {
      stringSelectedKeys.splice(existedIndex, 1);
    }

    this.setState({
      stringSelectedKeys: stringSelectedKeys
    });
    if (this.props.onSelected) {
      this.props.onSelected(info);
    }
  }

  visibleChange = () => {
    if (this.props.onVisibleChange) {
      let { type, column } = this.props;
      if (type === 'String') {
        const { stringSelectedKeys } = this.state;
        this.props.onVisibleChange({
          stringSelectedKeys,
          type,
          column
        });
      } else if (type === 'Number') {
        const { rangeSelectedFn, rangeResult, rangeResultInStart, rangeResultInEnd } = this.state;
        if (rangeSelectedFn === 'in') {
          this.props.onVisibleChange({
            rangeSelectedFn,
            rangeResultInStart,
            rangeResultInEnd,
            type,
            column
          });
        } else {
          this.props.onVisibleChange({
            rangeSelectedFn,
            rangeResult,
            type,
            column
          });
        }

      } else if (type === 'Date') {
        const { startTime, endTime } = this.state;
        this.props.onVisibleChange({
          startTime,
          endTime,
          type,
          column
        });
      } else {
        this.props.onVisibleChange({ ...this.state });
      }
    }
  }

  closeItem = (e: React.MouseEvent<HTMLElement>) => {
    this.setState({
      visible: false
    });
    if (this.props.onClose) {
      this.props.onClose(e);
    }
  }

  clickArrow = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    // console.log(e);
    e.nativeEvent.stopImmediatePropagation();
    const { type } = this.props;
    this.setState({
      visible: !this.state.visible
    });
    if (type === 'String' && !this.state.visible) {
      this.getSubFilterOptions();
    }

  }

  dateChange = (dvalues: any, formatString: [string, string]) => {
    // console.log(dvalues);
    // console.log(formatString);
    this.setState({
      startTime: formatString[0],
      endTime: formatString[1]
    });

  }

  dateSubmit = () => {
    // console.log('data submit');
    this.setState({
      visible: false
    });
    this.visibleChange();
  }

  rangeSelectedChange = (value: any, option: any) => {
    // console.log(value, option);
    this.setState({
      rangeSelectedFn: value
    });
  }

  rangeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event?.nativeEvent?.target as HTMLInputElement).value;
    this.setState({
      rangeResult: value
    });
  }

  rangeInputInStartChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event?.nativeEvent?.target as HTMLInputElement).value;
    // console.log(value);

    this.setState({
      rangeResultInStart: value
    });
  }

  rangeInputInEndChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event?.nativeEvent?.target as HTMLInputElement).value;
    console.log(value);

    this.setState({
      rangeResultInEnd: value
    });
  }

  rangeSubmit = () => {
    // console.log('rangeSubmit');
    this.setState({
      visible: false
    });
    this.visibleChange();
  }

  render() {
    let { text, type } = this.props;

    return (
      <Tag
        className="filterItem"
        closable={true}
        color="#A6CFBA"
        style={{ color: '#000' }}
        onClose={this.closeItem}
      >
        {
          type === 'String' && <Dropdown
            overlay={this.filterMenu}
            trigger={['click']}
            visible={this.state.visible}
            onVisibleChange={this.visibleChange}
          >
            <CaretDownOutlined
              className="filterItemArrow"
              style={{ color: '#000' }}
              onClick={(e) => { this.clickArrow(e); }}
            />
          </Dropdown>
        }
        {
          type === 'Date' && <Dropdown
            overlay={this.dateMenu}
            trigger={['click']}
            visible={this.state.visible}
            onVisibleChange={this.visibleChange}
          >
            <CaretDownOutlined
              className="filterItemArrow"
              style={{ color: '#000' }}
              onClick={(e) => { this.clickArrow(e); }}
            />
          </Dropdown>
        }
        {
          type === 'Number' && <Dropdown
            overlay={this.rangeMenu}
            trigger={['click']}
            visible={this.state.visible}
            onVisibleChange={this.visibleChange}
          >
            <CaretDownOutlined
              className="filterItemArrow"
              style={{ color: '#000' }}
              onClick={(e) => { this.clickArrow(e); }}
            />
          </Dropdown>
        }
        {text}
      </Tag>
    );
  }
}