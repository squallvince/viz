import * as React from 'react';
import { Tabs, Input } from 'antd';
import { BackInfoContext } from '../context';

const { TabPane } = Tabs;
const { Search } = Input;

export interface ITabsState {
  showFlag: boolean;
}
export interface ITabsProps {
  showFlag: boolean
}

class ITabs extends React.Component<ITabsProps, ITabsState> {
  static contextType = BackInfoContext;
  state = {
    showFlag: this.props.showFlag
  };
  callback = (key) => {
    this.context.record({ param: { type: 'tab', tab: key } });
  }
  renderData = () => {
    const { extract, sample } = this.context;
    const { data } = sample;
    let content: any = '';

    if (extract) {
      const { reg } = extract;
      reg.lastIndex = 0;
      const result = reg.exec(data);
      if (result) {
        content = (
          <>
            {data.slice(0, result.index)}
            <span className="columnLabel">{result[0]}</span>
            {data.slice(result.index+result[0].length,)}
          </>
        );
      } else {
        content = <>{data}</>;
      }
    } else {
      content = <>{data}</>;
    }
    return content;
    //  ReactDOM.render(content, this.ref.current);
  }
  watchValue = (e) => {
    this.context.record({
      param: { type: 'extract', extract: { result: null } }
    });
    this.context.record({
      param: { type: 'fieldName', fieldName: '' }
    });
  }
  onSearch = (value) => {
    if (!value) {
      return;
    }
    const { sample } = this.context;
    // const data =
    //   "Audit:[timestamp=09-30-2020 08:52:57.791, user=admin, action=search, info=granted REST: /search/jobs/1601455947.4271/control][n/a]";
    const reg = new RegExp(value, 'g');
    const result = sample.data.match(reg) || [];
    this.context.record({
      param: { type: 'extract', extract: { reg, result } }
    });
  }

  static getDerivedStateFromProps(props: any) {
    return {
      showFlag: props.showFlag
    };
  }
  render() {
    const { tab, extract, currentStep, sample } = this.context;
    const data = sample ? sample.data : '';
    let reg = '',
      result = []; // ["user="];
    if (extract) {
      reg = String(extract.reg).slice(1, -2);
      result = extract.result;
    }
    // const data =
    //   "Audit:[timestamp=09-30-2020 08:52:57.791, user=admin, action=search, info=granted REST: /search/jobs/1601455947.4271/control][n/a]";
    return (
      <div className="methodTabs">
        <h5 className="title">字段提取方式</h5>
        <Tabs onChange={this.callback} defaultActiveKey={tab} type="card">
          <TabPane tab="(.*?) 正则表达式" key="regex">
            <h5 className="title">样本</h5>
            <p>{this.state.showFlag && sample ? this.renderData() : data}</p>
            {currentStep === 1 ? (
              <Search
                placeholder="请输入正则表达式"
                enterButton="提取字段"
                size="small"
                defaultValue={reg}
                onChange={(e) => this.watchValue(e)}
                onSearch={this.onSearch}
              />
            ) : (
              <h5 className="title labels">
                已提取字段
                {result &&
                  result.map((item, idx) => {
                    return (
                      <span key={idx} className="columnLabel fetch">
                        {item}
                      </span>
                    );
                  })}
              </h5>
            )}
          </TabPane>
          {currentStep === 1 && (
            <TabPane tab="(X|Y|Z)分隔符" key="split">
              <h5 className="title">样本</h5>
              <p>{data}</p>
            </TabPane>
          )}
        </Tabs>
      </div>
    );
  }
}

export default ITabs;