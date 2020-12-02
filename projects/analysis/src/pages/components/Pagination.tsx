import React, { Component } from 'react';
import { Pagination, Layout } from 'antd';
const { Footer } = Layout;

export interface IPaginationProps {
  total: number;
  defaultCurrent: number;
  current: number;
  defaultPageSize: number;
  changePage(page: number, pageSize: any): void;
}

export interface IPaginationState { }

class Ipagination extends Component<IPaginationProps, IPaginationState> {
  render() {
    const { total, defaultCurrent, defaultPageSize, changePage, current } = this.props;
    return (
      <Layout>
        <Footer>
          <Pagination
            total={total}
            showTotal={(total: number) => `共 ${total} 条`}
            defaultPageSize={defaultPageSize}
            defaultCurrent={defaultCurrent}
            current={current}
            onChange={(page, pageSize) => {
              changePage(page, pageSize);
            }}
          />
        </Footer>
      </Layout>
    );
  }
}

export default Ipagination;
