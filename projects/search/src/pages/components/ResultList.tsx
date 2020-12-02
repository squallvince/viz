import * as React from "react";
import { Pagination } from 'antd';
import { List } from '../index/index'

interface ResultProps {
  pagination: {current: number, total: number | undefined};
  showDialog: (val: boolean, item: { title: string, url: string, content: string, type: string }) => void;
  resultList: List[];
  changePage: (current: number) => void;
}
interface ResultState {
}

class ResultList extends React.Component<ResultProps, ResultState>{
  constructor(props: ResultProps) {
    super(props);
    this.state = {}
  }
  params = {
    cur_page: 1
  }
  onChange = (page: number) => {
    this.props.changePage(page)
  }

  render() {
    const { resultList, pagination } = this.props;
    return (
      <div className="result-list">
        <ul className="list-section">
          {
            resultList.map((item, i) => {
              return (
                <li className="result-item" key={i} onClick={() => { this.props.showDialog(true, item) }}>
                  <img className="item-icon" src={item.imageUrl} alt="" />
                  <div className="item-content">
                    <p className="item-title">{item.title}</p>
                    <p className="item-desc">{item.abstracts}</p>
                    <div className="item-info">
                      <span>来源：{item.source}</span>
                      <span>更新时间：{item.date}</span>
                    </div>
                  </div>
                </li>
              )
            })
          }

        </ul>
        <Pagination showQuickJumper defaultCurrent={1} current={pagination.current} total={pagination.total} onChange={this.onChange} showSizeChanger={false} />
      </div>
    )
  }
}

export default ResultList