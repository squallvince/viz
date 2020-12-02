// @ts-nocheck  忽略ts类型校验
import React, {Component} from 'react';
import {
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Bar,
  Cell,
  Legend,
  Brush,
  ResponsiveContainer
} from 'recharts';

interface ITimelineBarData {
  isReal: boolean;
  querySql: string;
  timeType: string;
  startTime: any;
  endTime: any;
}

const CustomTooltip = ({active, payload, label}) => {
  if (active) {
    return (
                            <div>
                              <p>{`${label}`}</p>
                              <p>{`数量 : ${payload[0].value}`}</p>
                            </div>
    );
  }

  return null;
};
export default class WChart extends Component <ITimelineBarData> {
  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;
    this.state.ws.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log('connected');
    };

    this.state.ws.onmessage = evt => {
      // listen to data sent from the websocket server
      const message = JSON.parse(evt.data);
      if (this._isMounted) {
        this.addData(message);
      }
    };

    this.state.ws.onclose = () => {
      console.log('disconnected');
      // automatically try to reconnect on connection loss

    };
  }

  private addData(message: any) {
    this.setState({ddata: message.data});
  }

  constructor(props: ITimelineBarData) {
    super(props);
    this.state = {
      ddata: [],
      ws: new WebSocket('ws://10.146.143.59:18080/imserver/countSql'),
      activeIndex: -1
    };

  }

  componentDidUpdate() {
  }

  componentDidCatch() {
  }

  handleClick = (data, index) => {
    if (index === this.state.activeIndex) {
      this.setState({
        activeIndex: -1,
      });
    } else {
      this.setState({
        activeIndex: index,
      });
    }
  }

  render() {
    const {isDyn, querySql} = this.props;
    const {activeIndex, ddata} = this.state;
    if (querySql.length > 0) {
      const cond = {
        querySql: this.props.querySql,
        timeType: this.props.timeType,
        startTime: this.props.startTime,
        endTime: this.props.endTime
      };
      switch (this.state.ws.readyState) {
        case WebSocket.CONNECTING:

          break;
        case WebSocket.OPEN:
          if (cond.querySql.length > 0) {

            try {
              this.state.ws.send(JSON.stringify(cond));
            } catch (error) {
              console.log(error);
            }
          }
          break;
        case WebSocket.CLOSING:
          // do something
          break;
        case WebSocket.CLOSED:
          // do something
          break;
        default:
          // this never happens
          break;
      }
      if (ddata.length <= 0) {
        return (<div></div>)
      }
      return (
                              <div className="bar-chart-wrapper" data-fill="#1B1B23">
                                <div style={{color: '#878787'}}>
                                  <ResponsiveContainer width="100%" height={150} font>
                                    <BarChart isAnimationActive={false} height={100} data={ddata}
                                              fill="#1B1B23">
                                      <XAxis dataKey="time"/>
                                      <YAxis type="number" padding={{top: 15}}/>
                                      <Tooltip cursor={{fill: '#f00'}}/>
                                      <CartesianGrid vertical={false} fill="#1B1B23" stroke="#444444"
                                                     strokeDasharray="3 3"/>
                                      <Bar isAnimationActive={false} stackId="0" dataKey="all" fill="#e12f59"
                                           onClick={(data, index) => this.handleClick(data, index)}
                                           stroke="#a42c49">
                                        {
                                          ddata.map((entry, index) => (
                                                                  <Cell cursor="pointer"
                                                                        stroke={index === activeIndex ? '#ff9999' : '#a42c49'}
                                                                        key={`cell-${index}`}/>
                                          ))
                                        }
                                      </Bar>
                                      <Brush dataKey="time" height={25} stroke="#878787" fill="#1B1B23"/>
                                    </BarChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>
      );
    }
    return (<div/>);

  }

  componentWillUnmount() {
    this._isMounted = false;
    this.ws && this.ws.close();
  }
}
