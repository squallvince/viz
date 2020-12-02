import * as React from 'react';
import { Input } from "antd";
import { CloseOutlined } from '@ant-design/icons'
import { EditKeys } from '../drawer/mainContent/stepSplit'
export interface EditTableProps {
  editKeys: EditKeys[];
  editValues: string[];
  editFlag: string;
  delEditItem: (index: number) => void;
  saveEditData: (data: string, index: number) => void;
}

export interface EditTableStates {

}

class EditTable extends React.Component<EditTableProps, EditTableStates> {
  constructor(props: EditTableProps) {
    super(props);
  }
  inputChange(e: any, index: number) {
    this.props.saveEditData(e.target.value, index);
  }
  render() {
    const { editKeys, editValues, editFlag } = this.props;
    return (
      <div className="split-edit-table">
        <table>
          <tbody>
            <tr className="key-row">
              {
                editKeys.map((item: any, k: number) =>
                  <td key={k}>{
                    !item.eFlag ? item.t : <Input
                      defaultValue={item.t}
                      onChange={(e) => this.inputChange(e, k)}
                      suffix={
                        <CloseOutlined onClick={() => { this.props.delEditItem(k) }} />
                      } />
                  }
                  </td>
                )
              }
            </tr>
            <tr className="val-row">
              {
                editValues.map((v: string, k: number) => <td key={k} style={{ color: ((editFlag === 'edit' && editKeys[k].t !== '') || (editFlag === 'save' && editKeys[k].eFlag)) ? '#E5E5E5' : '#757883' }}>{v}</td>)
              }
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default EditTable;