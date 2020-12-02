/**
 * @time 2020-11-03
 * @desc 首页发送的请求
 */
import { customFetch } from "./utils";


export interface IRequestParams {
  query: string;
  page: number;
  pageSize: number;
}

// 根据sql查询数据
export const reqSearchData = (params: IRequestParams) => {
  return customFetch(`/api/v1.0/enterprise/search`, "GET", { ...params });
};

