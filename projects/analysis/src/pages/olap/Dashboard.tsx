import React from 'react';
import { LineChartCustom, QuotaChartCustom, ItemChartCustom } from '../../pages/components';


import 'less/olap/dashboard.less';
import { IShowType } from './ConvertType';
import { chartToVisua, transformToTHead } from './utils';
import { Empty, Table } from 'antd';

const prefix = 'COlapDashboard';

export interface IDataItem {
	key: string | number;
	[prop: string]: any;
}

export interface ISchemaItem {
	column: string;
	columnName: string;
	columnType: 'veidoo' | 'target';
	type: string;
}

export interface IDashboardProps {
	type: IShowType;
	datas: IDataItem[];
	selectDataSchema: ISchemaItem[];
	rowLength: number;
	columnLength: number;
}

export interface IDashboardState {
	chartData: {
		classification: { [key: string]: any };
		datas: IDataItem[];
	};
}

export default class Dashboard extends React.Component<
	IDashboardProps,
	IDashboardState
	> {
	constructor(props: IDashboardProps) {
		super(props);
		this.state = {
			chartData: {
				classification: {},
				datas: [],
			},
		};
	}

	static getDerivedStateFromProps(
		props: IDashboardProps,
		state: IDashboardState
	) {
		const chartData = chartToVisua({
			datas: props.datas,
			selectDataSchema: props.selectDataSchema,
		});

		return {
			...state,
			chartData: {
				...chartData,
			},
		};
	}

	// 渲染图表
	renderChart = (type: IShowType) => {
		const { chartData } = this.state;
		const { datas } = chartData;
		const { selectDataSchema } = this.props;

		const empty = (
			<div className={`${prefix}-empty`}>
				<img src="http://s4.qhres.com/static/596416e58e61154b.svg" />
				<div className="handleText">
					暂无数据
					{/* 当拖拽<span>维度</span>或<span>度量</span>
						至行、列区域， 这里会展示相应的图表 */}
				</div>
			</div>
		);
		if (!chartData.datas || chartData.datas.length === 0) {
			return empty;
		}

		// 获取各个类型的个数
		const dateLen = chartData.classification?.date?.length;
		const numberLen = chartData.classification?.number?.length;
		const stringLen = chartData.classification?.string?.length;

		const { rowLength, columnLength } = this.props;

		// 获取表格数据
		const columns = transformToTHead(this.props.selectDataSchema);
		// 给datas增加key作为唯一标识
		const keyDatas = this.props.datas.map((item, index) => ({...item, key: index}));
		switch (type) {
			case IShowType.table:
				// 表格展示无需判断
				return <Table 
									columns={columns}
									dataSource={keyDatas}
									rowKey={(row: any) => {
										return row.key;
									}}
									scroll={{x: columns.length * 200,y:500}}
									pagination={false}
								/>;
			case IShowType.bar:
				// 展示柱状图
				if(rowLength > 0 && columnLength > 0){
					return <ItemChartCustom data={chartData as any} />;
				}else {
					return <Empty description="不支持展示" />
				}
			case IShowType.line:
				// 展示折线图
				if(rowLength > 0 && columnLength > 0){
					return <LineChartCustom data={chartData as any} />;
				}else {
					return <Empty description="不支持展示" />
				}
			case IShowType.quota:
				// 展示指标图
				if(rowLength > 0 && columnLength > 0){
					return <QuotaChartCustom data={chartData as any} />;
				}else {
					return <Empty description="不支持展示" />
				}
			case IShowType.pie:
				// 展示饼图
				return <Empty description="不支持展示" />;
			case IShowType.scatter:
				// 展示散点图
				return <Empty description="不支持展示" />;
			default:
				return <Empty description="不支持展示" />;
		}
	};

	render() {
		return (
			<div className={prefix}>
				<div className={`${prefix}-chart`}>
					{this.renderChart(this.props.type)}
				</div>
				{/* <div className={`${prefix}-empty`}>
					<img src="http://s4.qhres.com/static/596416e58e61154b.svg" />
					<div className="handleText">
						当拖拽<span>维度</span>或<span>度量</span>
						至行、列区域， 这里会展示相应的图表
					</div>
				</div> */}
			</div>
		);
	}
}
