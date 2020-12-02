import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Modal, Form, Input, Button, Radio, message } from 'antd';
import { dateAddDays, randomPassword } from './util';
import {
  ClockCircleOutlined
} from '@ant-design/icons';

export interface IShareModalProps {
  currModal: number,
  item: any,
  onClose(): void
}
 
export interface IShareModalState {
  valiDate: number
}
const handleOk = () => {
  
};


 
const IShareModal: React.SFC<IShareModalProps> = (props) => {
  const { currModal, item, onClose } = props;
  const ref = useRef();
  const [valiDate, setValiDate] = useState(0);
  const [visible, setVisible] = useState(currModal===1);
  const [deadline, setDeadline] = useState('');
  const [link, setLink] = useState('');
  const [password, setPassword] = useState('');
  // 生成复制链接
  const generateLink = () => {
    const pwd = randomPassword();
    setPassword(pwd);
    return 'localhost:8233';
  };
  // 选择时间
  const onChange = (e) => {
    console.log(e)
    const valiDate = e.target.value
    const currTime = new Date().toLocaleDateString();
    let targetTime = ' '+new Date().getHours() + ':' + new Date().getMinutes();
    setValiDate(valiDate)
    switch (valiDate) {
      case 1: targetTime = dateAddDays(currTime, 3) + targetTime; break;
      case 2: targetTime = dateAddDays(currTime, 7) + targetTime; break;
      case 3: targetTime = dateAddDays(currTime, 30) + targetTime; break;
      default: targetTime = '- -';
    }
    setDeadline(targetTime);
    if (!link) {
      setLink(generateLink());
    }
  };
  // 重置时间
  const reset = () => {
    setValiDate(0);
    setLink('');
    setPassword('');
  };
  // 复制链接
  const copy = () => {
    console.log(ref.current.value)
    ref.current.select(); // 选中文本
      document.execCommand("copy"); // 执行浏览器复制命令
      message.success("复制成功");
  }
  const handleCancel = () => {
    setVisible(false)
    onClose();
  };
  return (
    <Modal
      title="分享仪表盘"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
      className="shareModal"
    >
      <div className="shareBody">
        <div className="line"><label>仪表盘名称</label><span>{ item.title }</span></div>
        <div className="line"><label>有效期</label>
        <Radio.Group onChange={onChange} value={valiDate} buttonStyle="solid">
          <Radio value={1}>3天</Radio>
          <Radio value={2}>7天</Radio>
          <Radio value={3}>30天</Radio>
          <Radio value={4}>永久有效</Radio>
          </Radio.Group>
        </div>
        {valiDate !== 0 && (
          <>
        <div className="hint">有效期至{ deadline }</div>
        <div className="line"><label>分享链接</label><span className="bordered">{link}</span>
          <textarea id="" cols="30" rows="10" value={`链接：${link} 密码：${password}`} ref={ref}></textarea>
        </div>
        <div className="line"><label>提取密码</label><span className="bordered">{password}</span> <Button type="primary" onClick={copy}>复制链接及密码</Button>
          <span className="resetBtn" onClick={reset}>
          <ClockCircleOutlined /> 重置
          </span>
            </div>
          </>
        )}

      </div>
    </Modal>
  );
};
 
export default IShareModal;