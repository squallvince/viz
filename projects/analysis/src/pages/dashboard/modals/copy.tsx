import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
const { TextArea } = Input;
import { copyBoard } from '../../../service/dashboard';

export interface ICopyBoardProps {
  item: any,
  currModal: number,
  onClose(): any
}
 
const ICopyBoard: React.SFC<ICopyBoardProps> = (props) => {
  const formRef = useRef();
  
  const { item, currModal, onClose } = props
  const [name, setName] = useState(`Copy-${item.name}`);
  const [desc, setDesc] = useState(item.describe);
  const onFinish = () => {
    const { id } = item;
    const param = Object.assign({id},formRef.current.getFieldsValue());
    if (!param.name) {
      message.error('请输入仪表盘名称')
      return 
    }
    copyBoard(param).then(res => {
      message.success('复制成功');
      onClose();
    })
  }
  return ( 
    <Modal
      title="仪表盘复制"
      visible={currModal===3}
      onCancel={onClose}
      className="detailModal"
      footer={[
        <Button key="submit" type="primary" onClick={onFinish}>
          确定
        </Button>
      ]}
    >
      <Form  ref={formRef} name="control-ref" initialValues={{name, desc}}>
      <Form.Item name="name" label="仪表盘名称" rules={[{ required: true }]}>
          <Input autoComplete="off"/>
        </Form.Item>
        <Form.Item name="describe" label="仪表盘描述">
          <TextArea autoComplete="off"/>
        </Form.Item>
      </Form>
      
    </Modal>
   );
}
 
export default ICopyBoard;