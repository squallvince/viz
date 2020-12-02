import React, { Component } from 'react';
import { Chart, Legend, View, Axis, Geom } from 'bizcharts';
import { Empty } from 'antd';


interface IObj {
	[key: string]: any;
}

interface ILineChartCustomProps {
	data: Array<IObj>;
	hasPre: boolean;
	hasHistory: boolean;
	hasArea: boolean;
}

interface ILineChartCustomState {
	// chartData: any;
}

const TYPES = ['date', 'timestamp'];

const isMatch = (param: any) => {

	const classificationKeys = Object.keys(param);
	const mixins = classificationKeys.filter((item) => {
		return TYPES.includes(item);
	});

	if (mixins.length === 0) {
		// message.warning("没有date类型字段");
		return false;
	}

	if (Reflect.has(param, 'string')) {

		// message.warning("有多余类型字段（如string）");
		return false;
	}

	if (!Reflect.has(param, 'number')) {
		// message.warning("没有number类型字段");
		return false;
	}

	return true;
};

class LineChartCustom extends Component<
	ILineChartCustomProps,
	ILineChartCustomState
	> {

	private scaleMax = Number.MIN_SAFE_INTEGER;

	constructor(props: ILineChartCustomProps) {
		super(props);
		this.state = {
			// chartData: []
		};
	}

	get chartHeight() {
		const clientHeight = document.documentElement.clientHeight - 380;
		return clientHeight < 500 ? 500 : clientHeight;
	}

	getStep = (max: number) => {
		let step = 1;
		while ((max / 10) > 1) {
			max = max / 10;
			step = step * 10;
		}
		return step / 2;
	}

	tranform = (): any => {
		const { data } = this.props;
		// console.log(data);

		if (data == null) return false;

		let ans: { y: number; x: any; group: string }[] = [];
		if (!isMatch(data.classification)) {
			return false;
		}
		if (data.classification.number == null) return false;
		if (data.classification.date == null) return false;
		data.datas.forEach((item, i) => {
			data.classification.number.forEach((sub) => {
				if (Number(item[sub] > this.scaleMax)) {
					this.scaleMax = Number(item[sub]);
				}
				const obj = {
					y: Number(item[sub]),
					x: item[data.classification.date[0]],
					group: `${sub}`,
				};
				ans.push(obj);
			});
		});
		return ans;
	};

	filterPredData = (chartData: any[]) => {
		return chartData.filter(item => item?.isPre);
	}

	render() {
		const { hasPre, hasHistory, hasArea } = this.props;

		let chartData = this.tranform();
		if (chartData === false) {
			return <Empty />;
		}
		const scale = {
			x: {
				mask: 'YYYY-MM-DD HH:mm:ss',
				range: [0.05, 0.95],
				sync: true,
				nice: true
			},
			y: {
				// 由于使用不同View，需要设定 scale 的 min 和 max
				min: 0,
				max: this.scaleMax + this.getStep(this.scaleMax)
			}
		};

		/**
		 * 假数据，最后要删除 start
		 */
		const preData = [
			{
				group: '_col1',
				x: '2020-10-10',
				y: 200,
				isPre: true
			},
			{
				group: '_col1',
				x: '2020-10-11',
				y: 100,
				isPre: true
			},
			{
				group: '_col1',
				x: '2020-10-12',
				y: 300,
				isPre: true
			}
		];
		if (hasPre) {
			chartData = chartData.concat(preData);
		}
		const areaPreData = [
			{
				group: '_col1',
				x: '2020-10-10',
				y: [100, 300],
			},
			{
				group: '_col1',
				x: '2020-10-11',
				y: [120, 400],
			},
			{
				group: '_col1',
				x: '2020-10-12',
				y: [150, 500],
			}
		];
		const historyData = [
			{
				group: '_col1',
				x: '2020-10-10',
				y: 400,
				isPre: true
			},
			{
				group: '_col1',
				x: '2020-10-11',
				y: 600,
				isPre: true
			},
			{
				group: '_col1',
				x: '2020-10-12',
				y: 800,
				isPre: true
			}
		];
		const areaHistoryData = [
			{
				group: '_col1',
				x: '2020-10-10',
				y: [300, 500],
			},
			{
				group: '_col1',
				x: '2020-10-11',
				y: [500, 700],
			},
			{
				group: '_col1',
				x: '2020-10-12',
				y: [700, 900],
			}
		]
		/**
		 * 假数据，最后要删除 end
		 */

		const preChartData = this.filterPredData(chartData);
		// console.log(chartData);
		// console.log(preChartData);

		return (
			<Chart
				padding={[20, 20, 50, 40]}
				autoFit
				height={this.chartHeight}
			>
				<View
					data={chartData}
					scale={scale}
				>
					<Axis name="x" />
					<Geom
						type="line"
						position="x*y"
						color="group"
						tooltip={true}
					>
					</Geom>
					<Geom
						type="point"
						position="x*y"
						size={4}
						shape={'circle'}
						tooltip={false}
						color="group"
					/>
				</View>
				<Legend
					namg="y"
					position="top-right"
					offsetY={20}
					itemName={{
						spacing: 10, // 文本同滑轨的距离
						style: {
							// stroke: 'blue',
							fill: '#EAEAEA',
							fontSize: 20
						}
					}}
				/>
				{/* 预测数据开始 */}
				{
					hasArea && <View
						data={areaPreData}
						scale={scale}
					>
						<Axis name="y" visible={false} />
						<Axis name="x" visible={false} />
						<Geom
							type="area"
							position="x*y"
							color={['group', ['#AFAFAF']]}
							// shape="dash"
							tooltip={false}
						/>
					</View>
				}
				{
					hasPre && <View
						data={preChartData}
						scale={scale}
					>
						<Axis name="y" visible={false} />
						<Axis name="x" visible={false} />
						<Geom
							type="line"
							position="x*y"
							color={['group', ['#fff']]}
							shape="dash"
							tooltip={false}
						/>
					</View>
				}
				{/* 预测数据结束 */}
				{/* 历史拟合数据开始 */}
				{
					hasArea && <View
						data={areaHistoryData}
						scale={scale}
					>
						<Axis name="y" visible={false} />
						<Axis name="x" visible={false} />
						<Geom
							type="area"
							position="x*y"
							color={['group', ['#AFAFAF']]}
							// shape="dash"
							tooltip={false}
						/>
					</View>
				}
				{
					hasHistory && <View
						data={historyData}
						scale={scale}
					>
						<Axis name="y" visible={false} />
						<Axis name="x" visible={false} />
						<Geom
							type="line"
							position="x*y"
							color={'group'}
							tooltip={false}
						/>
					</View>
				}
				{/* 历史拟合数据结束 */}
			</Chart>
		);
	}
}

export default LineChartCustom;
