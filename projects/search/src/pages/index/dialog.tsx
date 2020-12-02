import * as React from 'react';
import { Modal, Tabs, Spin } from 'antd';
import 'less/dialog.less';

const { TabPane } = Tabs;

export interface IModalProps {
  visible: boolean;
  item: any;
  closeDialog(flag: boolean): any;
}
 
class IModal extends React.Component<IModalProps> {
  constructor(props) {
    super(props)
  }
  render() {
    const { item, closeDialog } = this.props;
    const { title, content, url } = item;
    console.log(this.props)
    return (
        <Modal
          className="searchDialog"
          title={title}
          centered
          visible={this.props.visible}
          footer={null}
          width={1000}
          bodyStyle={{ height: '640px'}}
          onCancel={() => closeDialog(false)}
        >
          <Tabs defaultActiveKey="1">
            <TabPane tab="原始文档" key="1">
              {/* <Spin /> */}
              <embed
                src={url}
                width="100%"
                height="500px"
              ></embed>
            </TabPane>
            <TabPane tab="解析文档" key="2">
              <div className="content" dangerouslySetInnerHTML={{__html: content }}></div>
            </TabPane>
          </Tabs>
        </Modal>
    );
  }
}
 
export default IModal;