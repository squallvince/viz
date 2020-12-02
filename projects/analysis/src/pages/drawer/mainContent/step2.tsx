import * as React from 'react';
import { BackInfoContext } from '../context';
import ITabs from './tabs';
import {
  CheckOutlined,
  CloseOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { Pagination, Spin } from 'antd';
import { fetchList, getList } from '../common';
import {regMatchCount} from '../../../service/search'

export interface IValiProps {
    
}
 
export interface IValiState {
  listData: any[];
  total: number;
  regPage: number;
  loading: boolean;
  matchNum: number;
  unMatch: number
}
 
class ValiReg extends React.Component<IValiProps, IValiState> {
  state = { listData: [], total: 0, regPage: 1, loading: true, matchNum: -1, unMatch: -1 };
  static contextType = BackInfoContext;
  componentDidMount() {
    const { page, regPage, pageSize } = this.context;
    this.Change(regPage || page, pageSize);
    this.getCount();
  }
  getCount = async () => {
    let {
      sql,
      timeType,
      startTime,
      endTime,
      extract,
      selectColumns,
    } = this.context;
    let expression = '';
    if (extract) {
      expression = encodeURIComponent(String(extract.reg).slice(1, -2));
    }
    console.log(selectColumns);
    selectColumns = selectColumns.join(',');
    const result = await regMatchCount({
      sql,
      timeType,
      startTime,
      endTime,
      expression,
      selectColumns,
      type: 'regex',
    });
    if (result) {
       this.setState({
         matchNum: result.match,
         unMatch: result.total - result.match,
       });
    }
   
  };
  Change = (page: number, pageSize?: number) => {
    const { record } = this.context;
    const param = this.context;
    this.setState({
      loading: true,
    });
    getList({ ...param, page }).then((result) => {
      const listData = fetchList(result);
      console.log(listData)
      this.setState({
        regPage: page,
        listData,
        total: result.count,
        loading: false,
      });
      record({ param: { type: 'regPage', regPage: page } });
    });
  };
  renderRow = (item: any, idx: nunber) => {
    const { extract } = this.context;
    // const reg = /user=/g;

    const { data, id } = item;
    
    let content: any = '',
      mark: any = '';
    if (extract) {
      const { reg } = extract;
      reg.lastIndex = 0;
      const result = reg.exec(data);
      if (result){
        content = (
          <>
            {data.slice(0, result.index)}
            <span className='columnLabel'>{result[0]}</span>
            {data.slice(result.index+result[0].length,)}
          </>
        );
        mark = <CheckOutlined />;
      } else {
        content = data;
        mark = <CloseOutlined />;
      }
      return (
        <li key={id}>
          <span>{mark}</span>
          <span>{content}</span>
        </li>
      );
    }
  };
  render() {
    const { listData, total, matchNum, unMatch } = this.state;
    const { pageSize, regPage } = this.context;
    const currPage = regPage || this.state.regPage;
    return (
      <div className='step2'>
        <ITabs showFlag={true}></ITabs>
        <h5 className='title between'>
          <span>
            结果
            <span className='match'>
              <CheckOutlined />
              {matchNum === -1 ? <LoadingOutlined /> : `${matchNum}条`}
            </span>
            <span className='unmatch'>
              <CloseOutlined />
              {unMatch === -1 ? <LoadingOutlined /> : `${unMatch}条`}
            </span>
          </span>
          <Pagination
            size='small'
            total={total}
            showSizeChanger={false}
            onChange={this.Change}
            defaultPageSize={pageSize}
            defaultCurrent={currPage}
            current={currPage}
          />
        </h5>
        <Spin spinning={this.state.loading} />
        <ul className='regList'>
          {listData.map((item, idx) => {
            return this.renderRow(item, idx);
          })}
        </ul>
      </div>
    );
  }
}
 
export default ValiReg;