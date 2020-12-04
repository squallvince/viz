/*
 * @Author: Squall Sha
 * @Date: 2020-12-02 11:17:24
 * @Last Modified by: Squall Sha
 * @Last Modified time: 2020-12-02 17:26:42
 */

import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { transformToTHead } from '../../index/trans';

const TableComponent = ({ primary }) => {
  const [dataSources, setDataSource] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (!Array.isArray(primary)) {
      const { selectDataSchema, datas } = primary;
      setColumns(transformToTHead(selectDataSchema));
      setDataSource(datas);
    }
  }, [primary]);

  return (
    <>
      <Table
        dataSource={dataSources}
        columns={columns}
        pagination={false}
        tableLayout={'auto'}
        // scroll={{ x: this.scrollWidth }}
      />
    </>
  );
};

export default TableComponent;
