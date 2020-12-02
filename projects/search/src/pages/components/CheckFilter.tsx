import React, { useState } from "react";
import { Radio, Checkbox } from "antd";
import { sourceTypes, contentFormat, contentLabels } from './content';
const CheckboxGroup = Checkbox.Group;
export interface Iprops {

}
export interface Istate {
}
export default class checkFilter extends React.Component<Iprops, Istate>{
  state = {
    con_source: 1,
    con_format: 1,
    con_labels: ['产品说明书', '参考资料', '文档']
  }
  changeSource = (e: any) => {
    this.setState({
      con_source: e.target.value
    })
  }
  changeFormat = (e: any) => {
    this.setState({
      con_format: e.target.value
    })
  }
  changeCheckbox = (checkedList: any[]) => {
    this.setState({
      con_labels: checkedList
    })
  }
  render() {
    const { con_source, con_format, con_labels } = this.state;
    return (
      <>
        <p className="title">内容来源</p>
        <Radio.Group onChange={this.changeSource} value={con_source}>
          {
            sourceTypes.map(s => {
              return (
                <Radio value={s.key} key={s.key}>{s.type}<span className="radio-count">({s.count})</span></Radio>
              )
            })
          }
        </Radio.Group>
        <p className="title">内容格式</p>
        <Radio.Group onChange={this.changeFormat} value={con_format} size="small">
          {
            contentFormat.map(s => {
              return (
                <Radio value={s.key} key={s.key}>{s.type}<span className="radio-count">({s.count})</span></Radio>
              )
            })
          }
        </Radio.Group>
        <p className="title">内容标签</p>
        <CheckboxGroup onChange={this.changeCheckbox} value={con_labels}>
          {
            contentLabels.map(l => {
              return (
                <Checkbox value={l.type} key={l.key}>{l.type}<span className="radio-count">({l.count})</span></Checkbox>
              )
            })
          }
        </CheckboxGroup>
      </>
    )
  }
}