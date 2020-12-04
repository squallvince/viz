import React, { Component } from 'react';
import { Chart, Legend, View, Axis, Geom } from 'bizcharts';
import { Empty } from 'antd';


interface IObj {
	[key: string]: any;
}

interface IData {
	datas: Array<IObj>;
	classification: IClassification;
}

interface IPAData {
	chartIconActive: number,
	predictionVisible: boolean,
	hasPre: boolean,
	preData: Array<any>
	hasHistory: boolean,
	historyData: Array<any>
	hasArea: boolean,
	areaHistoryData: Array<any>,
	areaPreData: Array<any>
}

interface ILineChartCustomProps {
	data: IData;
	paData: IPAData;
}
interface IClassification {
	date: Array<string>;
	number: Array<string>;
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
	ILineChartCustomProps
	> {

	private scaleMax = Number.MIN_SAFE_INTEGER;

	constructor(props: ILineChartCustomProps) {
		super(props);
	}

	get chartHeight() {
		const clientHeight = document.documentElement.clientHeight - 300;
		return clientHeight < 500 ? 500 : clientHeight;
	}

	get scale() {
		return {
			x: {
				// mask: 'YYYY-MM-DD HH:mm:ss',
				range: [0.05, 0.95],
				sync: true,
				nice: true
			},
			y: {
				// 由于使用不同View，需要设定 scale 的 min 和 max
				min: 0,
				max: this.scaleMax + this.getStep(this.scaleMax)
			}
		}
	}

	getStep = (max: number) => {
		let step = 1;
		while ((max / 10) > 1) {
			max = max / 10;
			step = step * 10;
		}
		return step / 2;
	}

	tranform = (datas: Array<IObj>, classification: IClassification, isXArr = false): any => {
		let ans: { y: number | any[]; x: any; group: string }[] = [];
		if (!isMatch(classification)) {
			return false;
		}
		if (classification.number == null) return false;
		if (classification.date == null) return false;
		datas.forEach((item) => {
			classification.number.forEach((sub) => {
				if (Number(item[sub] > this.scaleMax)) {
					this.scaleMax = Number(item[sub]);
				}
				const obj = {
					y: isXArr ? [item.low, item.high] : Number(item[sub]),
					// x: item[classification.date[0]].substring(0, 16),
					// x: new Date(item[classification.date[0]]).getTime(),
					x: item[classification.date[0]],
					group: `${sub}`
				};
				ans.push(obj);
			});
		});
		return ans;
	}

	render() {
		const {
			hasPre,
			preData,
			hasHistory,
			historyData,
			hasArea,
			areaPreData,
			areaHistoryData } = this.props.paData;
		const { data } = this.props;

		if (data == null) {
			return <Empty />;
		}
		const { datas, classification } = data;
		let chartData = this.tranform(datas, classification);
		const _preData = this.tranform(preData, classification);
		const _historyData = this.tranform(historyData, classification);
		const _areaPreData = this.tranform(areaPreData, classification, true);
		const _areaHisrotyData = this.tranform(areaHistoryData, classification, true);

		if (chartData === false) {
			return <Empty />;
		}
		// if (hasPre) {
		// 	chartData = chartData.concat(_preData);
		// }
		// console.log(chartData);


		return (
			<Chart
				padding={[20, 20, 50, 40]}
				autoFit
				height={this.chartHeight}
			>
				<View
					data={chartData}
					scale={this.scale}
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
					(hasPre && hasArea) && <View
						data={_areaPreData}
						scale={this.scale}
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
						data={_preData}
						scale={this.scale}
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
					(hasHistory && hasArea) && <View
						data={_areaHisrotyData}
						scale={this.scale}
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
						data={_historyData}
						scale={this.scale}
					>
						<Axis name="y" visible={false} />
						<Axis name="x" visible={false} />
						<Geom
							type="line"
							position="x*y"
							color={['group', ['#fff']]}
							tooltip={false}
						/>
						{/* <Geom
							type="point"
							position="x*y"
							size={4}
							shape={'circle'}
							tooltip={false}
							color="group"
						/> */}
					</View>
				}
				{/* 历史拟合数据结束 */}
			</Chart>
		);
	}
}

export default LineChartCustom;
