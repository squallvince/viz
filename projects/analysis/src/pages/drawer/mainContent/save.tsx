import React from 'react';
import { Input, Table } from 'antd';
import { BackInfoContext } from '../context';
import { Debounce } from '../common';
export interface ISaveColumnProps {
}
export interface ISaveColumnState {
  value: string;
  params: any;
}
let columns: object[] = [];
let dataSource: object[] = [];
class ISaveColumn extends React.Component<ISaveColumnProps, ISaveColumnState> {
  static contextType = BackInfoContext;
  params: any = {};

  constructor(props: ISaveColumnProps) {
    super(props);

  }
  getFieldData = () => {
    let params = {};
    if (this.context.tab === "split") {
      const { editKeys, splitTab, splitInput } = this.context.split;
      const fieldArr = editKeys.filter((item: { t: string }) => item.t !== "");
      const field = fieldArr.map((d: { t: string }) => d.t).join(",");
      const index = fieldArr.map((d: { key: string }) => d.key).join(",");
      const expression: string = splitTab === "其他" ? encodeURIComponent(splitInput) : splitTab;
      params = { field, index, expression, type: 'split' };

    } else {
      const { fieldName, extract, sample } = this.context;
      let reg = "";
      if (extract) {
        reg = String(extract.reg).slice(1, -2);
      }
      params = { field: fieldName, expression: encodeURIComponent(reg), type: "regex", index: 0 };
      // params = { field: "name", expression: "user", type: "regex" };
    }
    const { sample, tab, sql } = this.context;
    const sendData = { ...params, example: sample.data, type: tab, sql }

    this.params = sendData;
    return sendData;
  }
  saved = (e) => {
    e.persist();
    Debounce(() => {
      const param = Object.assign({}, this.params, {
        configName: e.target.value,
        selectDataSchema: this.context.selectDataSchema
      });
      this.context.record({
        param: {
          type: 'saveParam',
          saveParam: param,
        },
      });
    }, 500)(e)
  }
  render() {
    const params = this.getFieldData();
    const { field, expression, type, example, index } = params;
    if (this.context.tab === "split") {
      const { editKeys, editValues } = this.context.split;
      columns = editKeys.map((d: { t: string }) => {
        return {
          key: d.t,
          title: d.t,
          dataIndex: d.t
        }
      })
      let splitItem: object = {};
      for (let j = 0; j < editKeys.length; j++) {
        let strKey: string = editKeys[j]['t'];
        splitItem[strKey] = editValues[j];
        splitItem['key'] = j;
      }
      dataSource = [{ ...splitItem }];
    }
    return (
      <div className='save-section'>
        <h3 className='title'>保存</h3>
        <ul className='configs'>
          <li>
            <span>配置名称</span>
            <span>
              <Input type='text' onChange={(e) => this.saved(e)} />
            </span>
          </li>
          <li>
            <span>字段名称</span>
            <span className="paragraph-name">{field}</span>
          </li>
          <li>
            {type === 'regex' ? <span>正则表达</span> : <span>分隔符</span>}
            <span className="expression">{decodeURIComponent(expression)}</span>
          </li>
          <li>
            <span>示例</span>
            <span className="paragraph-name">{example}</span>
          </li>
          <li>
            <span></span>
            <span className="text-example">{
              type === "split" && <Table dataSource={dataSource} columns={columns} pagination={false} />
            }</span>
          </li>
        </ul>
      </div>
    );
  }
}
export default ISaveColumn;