import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Modal, Form, Input, Button, Radio, message } from 'antd';
const { TextArea } = Input;
import { addBoard } from '../../../service/dashboard';

export interface IDetailsProps {
  item: any,
  currModal: number,
  onClose(): any
}
 
const IDetails: React.SFC<IDetailsProps> = (props) => {
  const formRef = useRef();
  const { item, currModal, onClose } = props;
  const [name, setName] = useState(item.name);
  const [desc, setDesc] = useState(item.describe);
  const onFinish = () => {
    console.log(formRef.current.getFieldsValue());
    const { id } = item;
    const param = Object.assign({id},formRef.current.getFieldsValue());
    if (!param.name) {
      message.error('请输入仪表盘名称');
      return;
    }
    addBoard(param).then(res => {
      message.success('编辑成功');
      onClose();
    });
  };
  return ( 
    <Modal
      title="仪表盘属性"
      visible={currModal === 2}
      onCancel={onClose}
      className="detailModal"
      style={{width: '560px'}}
      footer={[
        <Button key="submit" type="primary" onClick={onFinish}>
          保存
        </Button>
      ]}
    >
      <Form  ref={formRef} name="control-ref" initialValues={{name, describe: desc, id: item.id}}>
      <Form.Item name="name" label="仪表盘名称" rules={[{ required: true }]}>
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item name="describe" label="仪表盘描述">
          <TextArea autoComplete="off"/>
        </Form.Item>
      </Form>
      {/* <div><label>仪表盘名称</label><Input required/></div> */}
      {/* <div><label>仪表盘描述</label><TextArea /></div> */}
      <div><label>所有者</label> <span>Admin</span></div>
      <div><label>创建时间</label> <span>2020-10-30 14:53</span></div>
      <div><label>修改时间</label> <span>2020-10-30 14:53</span></div>
      
    </Modal>
   );
};
 
export default IDetails;