import * as React from 'react';
import { Input } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { BackInfoContext } from '../context';
import { Debounce } from '../common';

export interface IStepRegState {
}

class StepReg extends React.Component< IStepRegState> {
  static contextType = BackInfoContext;
    constructor(props) {
        super(props);
        this.state = { value: ''};

    }
  record = (e) => {
    e.persist();
    Debounce(() => {
      this.context.record({
        param: { type: 'fieldName', fieldName: e.target.value }
      });
    }, 500)(e);
        
    }
    render() {
      const { extract, fieldName } = this.context;
        let result = !extract ? [] : extract.result;
        let value = fieldName ? fieldName : '';
      return (
        <div className='stepReg'>
          {result && result.length===1 ? (
            <>
              <h5 className='title'>已提取字段</h5>
              <p>示例值</p>
            </>
          ) : (result && result.length > 1 ) ? (
            <>
              <p className='warning'>
                <ExclamationCircleOutlined />
                匹配结果较多，请调整正则表达式，确保结果唯一。
              </p>
            </>) : (result && result.length===0) ? (
            <>
              <p className='warning'>
                <ExclamationCircleOutlined />
                无匹配结果
              </p>
            </>) : '' }
          <ul>
            {result &&
              result.map((item, idx) => {
                return (
                  <li key={idx} className='regResult'>
                    <span>{item}</span>
                    {result.length === 1 && (
                      <Input
                        type='text'
                        placeholder='请输入字段名'
                        defaultValue={value}
                        onChange={(e) => this.record(e)}
                      />
                    )}
                  </li>
                );
              })}
          </ul>
        </div>
      );
  }
}

export default StepReg;