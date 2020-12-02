/**
 * @author 马骁
 * @time 2020-11-16
 * @description olap页面的请求
 */

import { IColumnSchema } from 'pages/olap';

//  获取基本的维度和指标
export interface IResponseInfo {
	table?: string;
	column: string;
	columnName: string;
	columnType: string;
	type: string;
}

export const getBasicInfo = (params: any) => {
	return (window as any).PromiseFetch(
		'/api/v1.0/viz/getField',
		{
			...params,
		},
		'post'
	);
};

// 新增字段请求
export interface IAddFieldRequest {
	querySql?: string;
	sourceSql?: string;
	startTime?: string;
	endTime?: string;
	timeType?: string;
	testFunction?: string;
	dataSchemaList?: IColumnSchema[];
}
export const validNewField = (params: IAddFieldRequest) => {
	return (window as any).PromiseFetch(
		'/api/v1.0/viz/test',
		{
			...params,
		},
		'post'
	);
};

export interface IFilterParamsItem {
	fieldName?: string;
	fieldShow?: string;
	filterEndValue?: string;
	symbolEnd?: string;
	symbolStart?: string;
	type?: string;
}

export interface ITargetItem {
	fieldMethod?: string;
	fieldName?: string;
	fieldShow?: string;
	fieldType?: string;
	type?: string;
}

export interface IVeidoo {
	fieldName?: string;
	fieldShow?: string;
	type?: string;
}

export interface IOlapReqParams extends IAddFieldRequest {
	dataSchemaList: IResponseInfo[];
	runParamVo: {
		filterParams: IFilterParamsItem[];
		targets: ITargetItem[];
		veidoos: IVeidoo[];
	};
}
// 查询图表数据
export const getQueryData = (params: IOlapReqParams) => {
	return (window as any).PromiseFetch(
		'/api/v1.0/viz/searchOlap',
		{
			...params,
		},
		'post'
	);
};

interface IOlapFilterOptions {
	dataSchemaList?: IColumnSchema[];
	querySql?: string;
	sourceSql?: string;
	startTime?: string;
	endTime?: string;
	timeType?: string;
	field?: ITargetItem;
}

export const getFilterStringOptions = (params: IOlapFilterOptions) => {
	return (window as any).PromiseFetch(
		'/api/v1.0/viz/getFieldDetail',
		{
			...params,
		},
		'post'
	);
};
