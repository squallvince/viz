import * as React from 'react';
import { Pagination, Spin } from 'antd';
import { BackInfoContext } from '../context';
import { fetchList, getList } from '../common';

export interface ISteps0Props {
  
}

export interface ISteps0State {
  activeItem: any;
  listData: any[];
  total: number;
  defaultCurrent: number;
  defaultPageSize: number;
  loading: boolean;
}

class ISteps0 extends React.Component<ISteps0Props, ISteps0State> {
  static contextType = BackInfoContext;
  state = {
    activeItem: '',
    listData: [],
    total: 0,
    defaultCurrent: 1,
    defaultPageSize: this.context.pageSize,
    loading: true
  };
  handleClick = (item) => {
    this.setState({
      activeItem: item,
    });
    this.noticeParent({ type: 'sample', sample: item });
  };
  queryList = (page) => {
    const param = this.context;
    this.setState({
      loading: true
    });
    getList({ ...param, page }).then(result => {
      const listData = fetchList(result);
      this.setState({
        listData,
        defaultCurrent: page,
        defaultPageSize: param.pageSize,
        total: result.count,
        loading: false,
      });
      this.noticeParent({ type: 'page', page });
      this.noticeParent({ type: 'listData', listData });
      this.noticeParent({ type: 'total', total: result.count });
    });
  }
  noticeParent = (param: any) => {
    const noticeInfo = { step: 'step0', param };
    this.context.record(noticeInfo);
  };
  componentDidMount() {
    const { page, pageSize, listData, total } = this.context;
    console.log(page, pageSize);
    if (listData) {
      this.setState({
        listData,
        total,
        loading: false
      });
    } else {
      // this.getExtractResult(page);
      this.queryList(page);
    }
    
  }
  render() {
    const { listData, total } = this.state;
    const { page, pageSize, sample } = this.context;
    return (
      <div className='step0'>
        {/* <div className="fetchColumn">
              <h5>字段提取方式</h5>
              <Form.Item label="选择列">
                <Select style={{ width: 128 }}>
                  <Select.Option value="demo">Demo</Select.Option>
                </Select>
              </Form.Item>
            </div> */}
        <div className='result'>
          <h5 className='title'>
            <span>结果</span>

            <Pagination
              size='small'
              total={total}
              showSizeChanger={false}
              onChange={this.queryList}
              defaultPageSize={pageSize}
              current={page}
              defaultCurrent={page}
            />
          </h5>
          <ul className='list'>
            <Spin spinning={this.state.loading} />
            {listData.map((item) => {
              return (
                <li
                  key={item.id}
                  className={
                    this.state.activeItem.id === item.id ||
                    (sample && sample.id === item.id)
                      ? 'active'
                      : ''
                  }
                  onClick={() => {
                    this.handleClick(item);
                  }}
                >
                  {item.data}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default ISteps0;