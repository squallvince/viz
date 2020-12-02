import React from 'react';
import ReactDOM from 'react-dom';

import { Form, Input, Button, message } from 'antd';
import NewFieldFormSelect from './components/NewFieldFormSelect';
import { validNewField } from '../../service/olap';
import { ITagItem } from './Dimension';
// import TextArea from 'antd/lib/input/TextArea';

// import 'less/olap/AddNewFieldModal.less';

export interface IFormVal{
  filter: string;
  name: string;
}

interface IAddNewFieldModalProps {
  fields: ITagItem[];
  queryParams: {
    queryEndTime?: string;
    querySql?: string;
    sourceSql?: string;
    queryStartTime?: string;
    timeType?: string;
  },
  onConfirm?: (formVal:IFormVal) => void;
}

interface IPos {
  start: number | any;
  end: number | any;
}

interface IAddNewFieldModalState {
  confirmDisable: boolean
}

const layout = {
  // labelCol: { span: 8 },
  wrapperCol: { span: 24 }
};

const footerStyle = {
  display: 'flex',
  justifyContent: 'flex-end'
};

const btnStyle = {
  marginRight: '20px'
};

export default class AddNewFieldModal extends React.Component<IAddNewFieldModalProps, IAddNewFieldModalState> {

  private formRef = React.createRef<any>();
  private textareaRef = React.createRef<any>();

  get textareaSelf() {
    return ReactDOM.findDOMNode(this.textareaRef.current)?.childNodes[0] as HTMLInputElement;
  }

  constructor(props: IAddNewFieldModalProps) {
    super(props);
    this.state = {
      confirmDisable: true
    };
  }

  getPosition = () => {
    let pos: IPos = {
      start: 0,
      end: 0
    };
    pos.start = this.textareaSelf.selectionStart;
    pos.end = this.textareaSelf.selectionEnd;
    return pos;
  }

  setPosition = (start: number, end: number) => {
    Promise.resolve().then(() => {
      this.textareaSelf.setSelectionRange(start, end);
    });
    // setTimeout(() => {
    //   this.textareaSelf.setSelectionRange(start, end);
    // });
  }

  textareaFocus = () => {
    this.textareaRef.current.focus();
  }

  getFormFilterValue = () => {
    return this.formRef.current.getFieldValue('filter') || '';
  }

  setFormFilterValue = (value: string, offset: number = 0) => {
    const startPos = this.getPosition().start;
    const endPos = this.getPosition().end;
    const oldValue = this.getFormFilterValue();
    const newValue = `${oldValue.substring(0, startPos)}${value}${oldValue.substring(endPos)}`;
    const newStartPos = startPos + value.length;
    const newEndpos = endPos + value.length - offset;

    this.formRef.current.setFieldsValue({
      filter: newValue
    });

    this.textareaFocus();
    this.setPosition(newStartPos, newEndpos);
  }

  onSelectedName = (param: string | any) => {
    // console.log(param);
    this.setFormFilterValue(`[${param.columnName}]`);

  }

  onSelectedFilter = (param: string | any) => {
    // console.log(param);
    this.setFormFilterValue(param, 1);

  }

  formCheck = () => {
    const result = this.formRef.current.validateFields().then();
    const { queryParams } = this.props;

    result.then(
      async(data:any) => {
        try {
          // TODO:执行校验逻辑
          await validNewField({...queryParams, testFunction: data.filter, dataSchemaList:[...this.props.fields]})
          this.setState({
            confirmDisable: false
          })
          message.success('校验成功');
        } catch (error) {
          console.log(error);
          message.error('校验失败');
          this.setState({
            confirmDisable: true
          })
        }
      },
      (error: any) => {
        console.log('失败',error);
      }
    );

  }

  formSubmit = () => {
    const formVal = this.formRef.current.getFieldValue();
    if(this.props.onConfirm){
      this.props.onConfirm(formVal);
    }
  }

  render() {
    const {confirmDisable} = this.state;

    return (
      <div className="modalForm">
        <Form
          {...layout}
          ref={this.formRef}
          name="form"
        >
          <Form.Item
            // label=" "
            name="name"
            rules={[{ required: true, message: '字段名称不能为空' }]}
          >
            <Input placeholder="字段名称，不能为空" />
          </Form.Item>

          <Form.Item
            name="filter"
            rules={[{ required: true, message: '公式不能为空' }]}
          >
            <Input.TextArea
              ref={this.textareaRef}
              // ref={(input) => this.textarea = input}
              autoSize={{ minRows: 6, maxRows: 6 }}
              showCount={true}
            />
          </Form.Item>

          <Form.Item
            name="select"
          >
            <NewFieldFormSelect fields={this.props.fields} onSelectedName={this.onSelectedName} onSelectedFilter={this.onSelectedFilter} />
          </Form.Item>

          <Form.Item>
            <footer style={footerStyle}>
              <Button onClick={() => {
                this.formCheck();
              }} type="default" style={btnStyle}>
                校验
              </Button>
              <Button type="primary" style={btnStyle} disabled={confirmDisable} onClick={this.formSubmit}>
                确定
              </Button>
            </footer>
          </Form.Item>
        </Form>
      </div>
    );
  }

}