import * as React from 'react';
 
class Finish extends React.Component {
    render() { 
        return (
          <div className="finish">
            <h1>保存成功</h1>
            <h5>您已从您的数据上提取其他字段。</h5>
            <h5>关闭后页面会自动刷新，同时启用新添加的字段。</h5>
          </div>
        );
    }
}
 
export default Finish;