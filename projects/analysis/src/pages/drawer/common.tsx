import * as React from 'react';
import { reqSearchData } from '../../service/search';

interface IResultObj {
  datas: any[],
  [key: string]: any
}

function getId(length: number) {
  return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
}
function fetchList(data: IResultObj) {
  // 把每一列组合成逗号连接的格式
  let listData = [],
    { datas } = data;
  // 日志数据
  if (data.logDatas) {
    listData = datas.map((v) => {
      const {_time, ...columns } = v
      return {
        id: getId(8),
        data: columns,
      };
    });
  } else {
    listData = datas.map((v) => {
      const { _time, ...columns } = v;
      return {
        id: getId(8),
        data: Object.values(columns).join(','),
      };
    });
  }
  return listData;
}
const getList = async ({
  sql,
  startTime,
  endTime,
  timeType,
  pageSize,
  selectColumns,
  page
}) => {
  const result = await reqSearchData({
    querySql: sql,
    timeType,
    selectColumns: selectColumns.join(','),
    page,
    pageSize,
    startTime,
    endTime,
  });
  return result;
};

let timer: any = null;
function Debounce(fn, delay): any {
  return (function (args) {
    console.log(args);
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.call(this, args);
    }, delay);
  });
}
export { fetchList, Debounce, getList };
