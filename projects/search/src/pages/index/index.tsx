import * as React from 'react';
import ResultList from '../components/ResultList';
import CheckFilter from '../components/CheckFilter';
import { Spin, Empty } from 'antd';
import { sourceTypes, contentFormat } from '../components/content';
import { SearchInput } from 'components';
import IDialog from './dialog';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { reqSearchData } from '../../service/search';

export interface ISearchAppProps {
}
import 'less/index.less';

export interface List {
  url: string;
  imageUrl: string;
  content: string;
  date: string;
  type: string;
  title: string;
  source: string;
  abstracts: string;
}
export interface ISearchAppState {
  loading: boolean;
  time: string;
  pagination: { current: number, pageSize: number, total: number | undefined };
  querySql: string;
  source: string;
  dialogVisible: boolean;
  detailObj: object;
  resultList: List[];
  emptyFlag: boolean;
}

const prefix: string = 'Enterprise';

class SearchApp extends React.Component<ISearchAppProps, ISearchAppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      loading: true,
      emptyFlag: false,
      time: '',
      pagination: {
        current: 1,
        pageSize: 10,
        total: undefined
      },
      querySql: '',
      source: '全部',
      dialogVisible: false,
      resultList: [],
      detailObj: {}
    };
  }

  // 点击Search后的数据
  getSearchResult = (obj: Object) => {
    const { querySql } = obj;
    if (obj) {
      this.setState({
        querySql,
        emptyFlag: false,
        pagination: {
          ...this.state.pagination,
          current: 1
        }
      },
        () => {
          this.getSearchData();
        }
      );
    }
  };

  // 获取数据
  getSearchData = async () => {
    const { pagination, querySql } = this.state;
    this.setState({
      loading: true,
    });
    try {
      const params = {
        query: querySql,
        page: pagination.current,
        pageSize: pagination.pageSize,
      }
      const { rows, total, time } = await reqSearchData(params);
      this.setState({
        resultList: rows ? rows : [],
        emptyFlag: !(rows && rows.length > 0),
        time,
        pagination: {
          ...pagination,
          total
        }
      });
    } catch (error) {
      console.log(error.code);
      this.resetData();
      this.setState({
        loading: false,
        emptyFlag: true
      });
    } finally {
      this.setState({
        loading: false
      });
    }
  };
  resetData = () => {
    this.setState({
      resultList: [],
      time: ''
    })
  }
  changePage = (current: number) => {
    const { pagination } = this.state;
    this.setState({
      pagination: { ...pagination, current }
    }, () => {
      this.getSearchData()
    })
  }
  handleDialog = (val: boolean, item: { title: string, url: string, content: string, type: string }) => {
    if (val === true && item) {
      const { title, url, content, type } = item
      this.setState({
        detailObj: { title, url, content, type }
      }, () => {
        console.log('传递详情数据', this.state.detailObj)
      })
    }
    this.setState({
      dialogVisible: val
    });
  }

  // 性能优化
  shouldComponentUpdate(
    nextProps: ISearchAppProps,
    nextState: ISearchAppState
  ) {
    if (JSON.stringify(nextState) === JSON.stringify(this.state)) {
      return false;
    }
    return true;
  }

  render() {
    const { dialogVisible, resultList, loading, pagination, time, detailObj, emptyFlag } = this.state;
    return (
      <div className={`${prefix} page-init`}>
        <h1 className={`${prefix}-title`}><span className="font-normal">企业搜索</span></h1>
        <div className={`${prefix}-bar`}>
          <SearchInput
            callback={this.getSearchResult}
          />
        </div>
        {
          dialogVisible === true && <IDialog visible={dialogVisible} closeDialog={this.handleDialog} item={detailObj} />
        }
        <div className={`${prefix}-main`}>
          <Spin spinning={loading}></Spin>
          {
          resultList.length > 0 &&
            <div className="main-inner">
              <div className="result-info">
                <ExclamationCircleOutlined />
                <p className="info-tip">本次为您找到{pagination.total}个相关结果，共计用时：{time}</p>
              </div>
              <div className={`${prefix}-lAside`}>
                <CheckFilter />
              </div>
              <ResultList pagination={pagination} resultList={resultList} showDialog={this.handleDialog} changePage={this.changePage} />
              <div className={`${prefix}-rAside`}>
                <p className="title">相关文档</p>
                <ul>
                  {
                    sourceTypes.map((s: { type: string, key: number }) => {
                      return (
                        <li className="relate-item" key={s.key}>{s.type}</li>
                      )
                    })
                  }
                </ul>
                <p className="title">相关搜索</p>
                <ul>
                  {
                    contentFormat.map((s: { type: string, key: number }) => {
                      return (
                        <li className="relate-item" key={s.key}>{s.type}</li>
                      )
                    })
                  }
                </ul>
              </div>
            </div>
          }
          {
            emptyFlag === true && <Empty />
          }
        </div>
      </div>
    );
  }
}

export default SearchApp;
