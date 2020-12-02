import React, { Component } from 'react';
import { Empty, message } from 'antd';

import '../../less/QuotaChartCustom.less';

interface IQuoProps {
  stringType: string;
  numberType: string;
}


interface IAnyObj {
  [key: string]: any;

}

interface IQuotaChartCustomProps {
  data: IAnyObj[]
}

interface IQuotaChartCustomState {

}

function QuotaChartCustomItem(props: IQuoProps) {
  return (
    <div className="quotaChartItem">
      <header title={props.stringType}>{props.stringType}</header>
      <main>
        {/* <span className="unit">￥</span> */}
        <span className="content" title={props.numberType}>{props.numberType}</span>
      </main>
      {/* <footer>
        <i className="iconfont iconarrowBottomLine"></i>
        <span className="text">较上季度上涨</span>
        <span className="compare">1.25%</span>
      </footer> */}
    </div>
  );
}

const  TYPES = ['date', 'timestamp'];


const isMatch = (param: any) => {
  if (param == null) return false;
  const classificationKeys = Object.keys(param);
  const mixins = classificationKeys.filter(item => {
    return TYPES.includes(item);
  });

  if (mixins.length > 0) {
    // message.warning('有date字型字段');
    return false;
  }
  if (classificationKeys.length !== 1) {
    // message.warning('有多余类型字段（如string）');
    return false;
  }
  if (classificationKeys[0] !== 'number') {
    // message.warning('没有number类型字段');
    return false;
  }
  return true;
}

class QuotaChartCustom extends Component<IQuotaChartCustomProps, IQuotaChartCustomState> {

  get chartHeight() {
    const clientHeight = document.documentElement.clientHeight - 380;
    return clientHeight < 500 ? 500 : clientHeight;
  }

  constructor(props: IQuotaChartCustomProps){
    super(props);
    this.state = {};
  }

  // static getDerivedStateFromProps(props: IQuotaChartCustomProps, state: IQuotaChartCustomState) {
  //   const { data } = props;
  //   isMatch(data.classification);
  //   return {
  //     ...state
  //   };
  // }

  // componentDidMount(){
  //   const {data} = this.props;
  //   isMatch(data.classification);

  // }

  render() {
    const { data } = this.props;
    if (!isMatch(data?.classification)) {
      return <Empty />;

    }

    if (data.datas.length > 1) {
      return <Empty />;

    }
    if (data?.classification.number == null){
      return <Empty />;

    }
    return (
      <div className="quotaChart">

        {
          data.datas.map((item: IAnyObj, i: number) => {
            return <QuotaChartCustomItem
              stringType={data?.classification.number[0]}
              numberType={item[data?.classification.number[0]]}
              key={i}
            />;
          })
        }
      </div>
    );
  }
}

export default QuotaChartCustom;