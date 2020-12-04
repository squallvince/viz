/**
 * @author 马骁
 * @time 2020-11-03
 * @desc 首页发送的请求
 */
import { customFetch, transferQueryStr } from './utils';

export enum IStatistical {
	false,
	true
}

export enum ILogDatas {
	false,
	true
}

export interface IRequestParams {
	querySql: string;
	page: number;
	pageSize: number;
	selectColumns?: string;
	timeType?: string;
	startTime?: string;
	endTime?: string;
}

export interface ISchema {
	table: string;
	column: string;
	type: string;
}

export interface IAnyObj {
	[prop: string]: any;
}

export interface IResponseData {
	dataSchema: ISchema[];
	selectDataSchema: ISchema[];
	datas: IAnyObj[];
	statisticalFunction: IStatistical;
	logDatas: ILogDatas;
	showSql: string;
	page: number;
	pageSize: number;
	count: number;
}

// 保存仪表盘interface
export interface panelsItem {
	name: string;
	sqlText?: string;
}
export interface IDashboardRequest {
	id?: string | number;
	name?: string;
	describe?: string;
	panels?: panelsItem[];
}

// 保存报表interface
export interface IReportRequest {
	describe?: string;
	id?: number;
	name: string;
	querySql: string;
}

// 保存csvinterface
export interface ICsvRequest {
	selectColumns?: string;
	querySql: string;
	timeType?: string;
	startTime?: string;
	endTime?: string;
}

// 根据sql查询数据
export const reqSearchData = (params: IRequestParams) => {
	return (window as any).PromiseFetch(
		'/api/v1.0/viz/datas',
		{ ...params },
		'get'
	);
};

// 获取已有的仪表盘列表
export const reqDashboardList = () => {
	return (window as any).PromiseFetch('/api/v1.0/dashboard');
};

// 另存/保存为仪表盘
export const saveDashboard = (params: IDashboardRequest) => {
	return (window as any).PromiseFetch(
		'/api/v1.0/dashboard',
		{ ...params },
		'post'
	);
};

// 保存为报表
export const saveReport = (params: IReportRequest) => {
	return (window as any).PromiseFetch(
		'/api/v1.0/viz/report',
		{ ...params },
		'post'
	);
};

// 保存为csv
export const downLoadCsv = (params: ICsvRequest) => {
	let url = '/api/v1.0/viz/downLoad';
	url += transferQueryStr(params);
	return url;
	// return customFetch(`/api/v1.0/viz/downLoad`, "GET", { ...params });
};

export interface ConfigParams {
	configName: string;
	example: string;
	expression: string;
	field: string;
	index: string;
	sql: string;
	type: string;
}

export interface regMatchParams {
	sql: string;
	timeType: string;
	startTime: string;
	endTime: string;
	expression: string;
	selectDataSchema: object[];
	type: string;
}

// 抽屉保存
export const saveConfig = (params: ConfigParams) => {
	return (window as any).PromiseFetch(
		'/api/v1.0/extract/saveConfig',
		{ ...params },
		'post'
	);
};
// 统计正则结果
export const regMatchCount = async (params: regMatchParams) => {
	return (window as any).PromiseFetch(
		'/api/v1.0/extract/resultStatistic',
		{ ...params },
		'get'
	);
};

/**
 * PA预测
 */
export interface IPAAnalyseParams {
	periods: string;
  unit: string;
  fit: string;
  confidence: string
  mape: boolean;
  selectedItemKey: string;
  time: string;
	querySql: string;
	timeType: string;
	endTime: string;
	startTime: string;
}
export const analysePA = async (params: IPAAnalyseParams) => {
	return (window as any).PromiseFetch(
		'/api/v1.0/viz/analyse',
		{ ...params },
		'post'
	);
};
