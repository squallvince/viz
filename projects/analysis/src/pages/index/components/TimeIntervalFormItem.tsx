/**
 * 预测弹层，
 */
import React from 'react';
import { Input, Select } from 'antd';

const { Option } = Select;

interface IValue {
  multiple: string;
  unit: string;
}

interface ITimeIntervalFormItemProps {
  value?: IValue;
  onChange?: (value: IValue) => void;
}

interface ITimeIntervalFormItemState {
  multiple?: string;
  unit?: string;
}

const units = [
  {
    key: '1',
    value: '倍'
  },
  {
    key: '2',
    value: '次'
  }
];

export default class TimeIntervalFormItem extends React.Component<ITimeIntervalFormItemProps, ITimeIntervalFormItemState>{

  private timer: any = null;

  constructor(props: ITimeIntervalFormItemProps) {
    super(props);
    // this.state = {
    //   multiple: '1',
    //   unit: '1'
    // };
  }

  // componentDidMount(){
  //   console.log(this.props.value);

  // }

  inputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(event);
    event.persist();
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      // console.log(event.target.value);
      this.setState({
        multiple: event.target.value
      });
      this.triggerChange({ multiple: event.target.value });
    }, 200);
  }

  selectChange = (value: string) => {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.setState({
        unit: value
      });
      this.triggerChange({ unit: value });
    }, 200);
  }

  triggerChange = (changedValue: any) => {
    const { onChange } = this.props;
    const { multiple, unit } = this.state;
    if (onChange) {
      onChange({ multiple, unit, ...changedValue });
    }
  }

  render() {
    const { value } = this.props;
    return <React.Fragment>
      <Input
        style={{ width: 100 }}
        defaultValue={value?.multiple}
        onChange={this.inputChange}
      />
      <Select
        defaultValue={value?.unit}
        onChange={this.selectChange}
        style={{ width: 50 }}>
        {
          units.map(item => {
            return <Option key={item.key} value={item.key}>{item.value}</Option>;
          })
        }
      </Select>

    </React.Fragment>;
  }

}