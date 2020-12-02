interface IDashBoardList {
  page: number,
  pageSize: number,
  keyword?: string,
  condition?: string,
  sortord?: string
}
interface INewBoard {
  describe?: string,
  id?: number,
  name: string
}

export const getDashboardList = (params: IDashBoardList) => {
    return (window as any).PromiseFetch(
      '/api/v1.0/dashboard/list',
      { ...params },
      'get'
    );
};
// 新增/编辑仪表盘属性接口
export const addBoard = (params: INewBoard) => {
    return (window as any).PromiseFetch(
      '/api/v1.0/dashboard/property',
      { ...params },
      'POST'
    );
};
// 仪表盘复制
export const copyBoard = (params: INewBoard) => {
    return (window as any).PromiseFetch(
      '/api/v1.0/dashboard/copy',
      { ...params },
      'POST'
    );
};
// 仪表盘删除
export const deleteBoard = (params: {id: number}) => {
    return (window as any).PromiseFetch(
      '/api/v1.0/dashboard/delete',
      { ...params },
      'POST'
    );
};
