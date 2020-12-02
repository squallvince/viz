import React, { Component } from 'react';
import { Chart, Interval, Tooltip, Legend, Coordinate } from 'bizcharts';
import { Empty, message } from 'antd';

interface IItemChartCustomProps {
  data: Array<any>
}

interface IItemChartCustomState {

}

const TYPES = ['date', 'timestamp'];

const isMatch = (param: any) => {
  const classificationKeys = Object.keys(param);
  const mixins = classificationKeys.filter(item => {
    return TYPES.includes(item);
  });

  if (mixins.length > 0) {
    // message.warning('有date类型字段');
    return false;
  }

  if (!Reflect.has(param, 'number')) {
    // message.warning('没有number类型字段');
    return false;
  }

  if (param?.number?.length !== 1) {
    // message.warning('number类型字段过多');
    return false;
  }

  if (!Reflect.has(param, 'string')) {
    // message.warning('没有string类型字段');
    return false;
  }

  if (param?.string?.length > 2) {
    // message.warning('string类型字段过多');
    return false;
  }
  return true;
}

class ItemChartCustom extends Component<IItemChartCustomProps, IItemChartCustomState> {

  get chartHeight() {
    const clientHeight = document.documentElement.clientHeight - 380;
    return clientHeight < 500 ? 500 : clientHeight;
  }

  constructor(props: IItemChartCustomProps) {
    super(props);
    this.state = {};
  }

  // {
  //   x:'',
  //   y:'',
  //   group: ''
  // }
  tranform = () => {
    const { data } = this.props;
    // console.log(data);
    if (data == null) return false;

    let ans: { y: number; x: any; group: string; }[] = [];
    if (!isMatch(data.classification)) {
      return false;
    }
    if (data.classification.string == null) return false;
    if (data.classification.number == null) return false;
    data.classification.string.forEach(item => {
      data.datas.forEach(sub => {
        const obj = {
          // x:`${sub[item]}`,
          x: sub[data.classification.string[0]],
          y: Number(sub[data.classification.number[0]]),
          group: `${item}`
        };
        ans.push(obj);
      });
    });
    // console.log(ans);

    return ans;
  }


  // static getDerivedStateFromProps(props: IItemChartCustomProps, state: IItemChartCustomState) {
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
    const chartData = this.tranform();
    // console.log(chartData);
    
    if (chartData === false) {
      return <Empty />;
    }
    return (
      <Chart
        padding={[70, 0, 50, 100]}
        autoFit
        height={this.chartHeight}
        data={chartData}
      >
        <Coordinate transpose />
        <Interval
          position="x*y"
          color="group"
          // color={['group', ['#5B7EE2', '#5BB7E2']]}
          adjust={[
            {
              type: 'stack',
              marginRatio: 0
            }
          ]}
        />
        <Tooltip shared />
        <Legend
          position="top-right"
          offsetY={20}
          marker={{
            symbol: 'circle'
          }}
          itemName={{
            spacing: 10, // 文本同滑轨的距离
            style: {
              // stroke: 'blue',
              fill: '#EAEAEA',
              fontSize: 20
            }
          }}
        />
        {/* <Geom
          type="area"
          position="year*value"
          size="20"
        /> */}

      </Chart>
    );
  }

}

export default ItemChartCustom;