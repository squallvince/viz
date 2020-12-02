import { Button, Tooltip } from 'antd';
import React, { useState } from 'react';
import 'less/olap/convertType.less';

const prefix = 'CConvertType';

export interface IConvertTypeProps {
	onTypeChange?: (type: IShowType) => void;
	handleQuery?: () => void;
}

export enum IShowType {
	'table' = 1,
	'bar' = 2,
	'line' = 3,
	'quota' = 4,
	'pie' = 5,
	'scatter' = 6,
}

export const showTypeText = {
	[IShowType.table]: '表格',
	[IShowType.bar]: '柱状图',
	[IShowType.line]: '折线图',
	[IShowType.quota]: '指标图',
	[IShowType.pie]: '饼图',
	[IShowType.scatter]: '散点图',
};

export default (props: IConvertTypeProps) => {
	const [activeIndex, setActiveIndex] = useState(0);

	const renderConverts = [
		{
			key: IShowType.table,
			url: 'iconolapChartTable',
			renderTip: ['1或多个维度(至少一个)', '1或多个度量'],
		},
		{
			key: IShowType.bar,
			url: 'iconolapChartItem',
			renderTip: ['1或多个维度(至少一个)', '1或多个度量'],
		},
		{
			key: IShowType.line,
			url: 'iconolapChartLine',
			renderTip: ['1或多个维度(至少一个)', '1或多个度量'],
		},
		{
			key: IShowType.quota,
			url: null,
			renderTip: ['1或多个维度(至少一个)', '1或多个度量'],
		},
		// {
		// 	key: IShowType.pie,
		// 	url: 'iconolapChartPipe',
		// 	renderTip: ['1或多个维度(至少一个)', '1或多个度量'],
		// },
		// {
		// 	key: IShowType.scatter,
		// 	url: 'iconolapChartPlot',
		// 	renderTip: ['1或多个维度(至少一个)', '1或多个度量'],
		// },
	];

	const renderTooltip = (arr: string[]) => {
		return arr.map((item, index) => {
			return (
				<div key={index} className={`${prefix}-tooltip`}>
					<span></span>
					{item}
				</div>
			);
		});
	};

	// 点击查询按钮
	const query = () => {
		if (props.handleQuery) {
			props.handleQuery();
		}
	};

	return (
		<div className={prefix}>
			<Button
				className={`${prefix}-query`}
				style={{ height: '40px' }}
				type="primary"
				onClick={query}
			>
				查询
			</Button>
			<div className={`${prefix}-convert`}>
				{renderConverts.map((item, i) => {
					return (
						<Tooltip title={renderTooltip(item.renderTip)} key={item.url}>
							<div
								className={`convert-item iconfont ${
									item.url ? item.url : null
								} ${activeIndex === i ? 'active' : null}`}
								onClick={() => {
									setActiveIndex(i);
									if (props.onTypeChange) {
										props.onTypeChange(item.key);
									}
								}}
							>
								{item.url ? null : '35'}
							</div>
						</Tooltip>
					);
				})}
			</div>
		</div>
	);
};
