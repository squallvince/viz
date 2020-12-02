import React from 'react';

import 'less/olap/index.less';
import { Button, message, Spin } from 'antd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { RouteComponentProps } from 'react-router';
import Dimension, { ITagItem } from './Dimension';
import Measure from './Measure';
import DropArea, { IDataParams } from './DropAreas';
import Dashboard, { IDataItem } from './Dashboard';
import ConvertType, { IShowType } from './ConvertType';

import { Modal } from 'antd';
import AddNewFieldModal, { IFormVal } from './AddNewFieldModal';
import {
	getBasicInfo,
	getQueryData,
	IFilterParamsItem,
	IResponseInfo,
	ITargetItem,
	IVeidoo,
} from '../../service/olap';
import { ECountType } from './components/DragTag';
import CommonDialog from './components/CommonDialog';

interface IOlapState {
	modalVisible: boolean;
	showType: IShowType;
	datas: IDataItem[];
	dataSchema: any[];
	measureData: ITagItem[];
	dimensionData: ITagItem[];
	modalFields: ITagItem[];
	querySchemas: ITagItem[];
	dropDatas: {
		filterParams: IFilterParamsItem[];
		targets: ITargetItem[];
		veidoos: IVeidoo[];
	};
	queryLoading: boolean;
	showDialog: boolean;
	dialogType: string;
	queryRowLength: number;
	queryColumnLength: number;
}

export interface IOlapQueryParams {
	sourceSql?: string;
	queryEndTime?: string;
	querySql?: string;
	queryStartTime?: string;
	timeType?: string;
}

const prefix = 'POlap';
export default class Olap extends React.Component<
	RouteComponentProps<{}, any, IOlapQueryParams>,
	IOlapState
> {
	constructor(props: RouteComponentProps<{}, any, IOlapQueryParams>) {
		super(props);
		this.state = {
			modalVisible: false,
			showType: IShowType.table,
			datas: [],
			dataSchema: [],
			measureData: [],
			dimensionData: [],
			modalFields: [],
			querySchemas: [],
			dropDatas: {
				filterParams: [],
				targets: [],
				veidoos: [],
			},
			queryLoading: false,
			showDialog: false,
			dialogType: '',
			queryRowLength: 0,
			queryColumnLength: 0,
		};
	}

	componentDidMount() {
		// 获取维度和指标的初始数据;
		this.getMeasureAndDimension();
	}

	// 发送获取维度和指标的请求
	getMeasureAndDimension = async () => {
		const { state } = this.props.location;
		try {
			const res = await getBasicInfo({ ...state });
			if (res) {
				const measure = res
					.filter((item: IResponseInfo) => item.columnType === 'target')
					.map((item: IResponseInfo) => ({
						column: item.column,
						columnName: item.columnName,
						columnType: item.type,
						countType: ECountType.sum,
						table: item.table,
						type: item.columnType,
					}));
				const dimension = res
					.filter((item: IResponseInfo) => item.columnType === 'veidoo')
					.map((item: IResponseInfo) => ({
						column: item.column,
						columnName: item.columnName,
						columnType: item.type,
						countType: ECountType.sum,
						table: item.table,
						type: item.columnType,
					}));
				this.setState({
					dimensionData: dimension,
					measureData: measure,
					querySchemas: res,
					modalFields: res,
				});
			}
		} catch (error) {
			console.log(error);
		}
	};

	// 根据维度和指标进行格式转换，转换为后端需要的格式，保存到state
	transToQuerySchema = (measure: ITagItem[], dimension: ITagItem[]) => {
		const newArr: ITagItem[] = [...measure, ...dimension].map((item) => {
			return {
				table: item.table,
				column: item.column,
				columnName: item.columnName,
				columnType: item.type as string,
				type: item.columnType,
			};
		});
		return newArr;
	};

	back = () => {
		this.props.history.go(-1);
	};

	saveAsReport = () => {
		// TODO:执行保存为报表的逻辑,暂时不做保存，前端做个效果即可
		this.setState({
			showDialog: true,
			dialogType: 'table',
		});
	};

	saveAsDashboard = () => {
		// TODO:执行保存为仪表盘的逻辑,暂时不做保存，前端做个效果即可
		this.setState({
			showDialog: true,
			dialogType: 'chart',
		});
	};

	addNewField = () => {
		this.openModal();
	};

	/**
	 * baclona modal start
	 */
	openModal = () => {
		this.setState({
			modalVisible: true,
		});
	};

	closeModal = () => {
		this.setState({
			modalVisible: false,
		});
	};

	submitModal = () => {};

	cancleModal = () => {};
	/**
	 * baclona modal end
	 */

	// 监听drop区域的变化
	dropFieldsChange = (type: string, data: IDataParams) => {
		console.log('dropChange', type, data);
		const { row, column, filter } = data;
		// 转换为请求后端所需的格式
		const veidoos: IVeidoo[] = row.map((item) => {
			return {
				fieldName: item.columnName,
				fieldShow: item.column.split('&')[0],
				type: item.columnType,
			};
		});

		const targets: ITargetItem[] = column.map((item) => {
			return {
				fieldName: item.columnName,
				fieldShow: item.column.split('&')[0],
				fieldMethod: item.countType,
				fieldType: item.type as string,
				type: item.columnType,
			};
		});

		const filterParams: IFilterParamsItem[] = filter.map((item) => {
			switch (item.columnType) {
				case 'String':
					return {
						fieldName: item.columnName,
						fieldShow: item.column,
						filterEndValue: '',
						filterStartValue: item.selectedKey,
						symbolEnd: '',
						symbolStart: 'in',
						type: item.columnType,
					};
				case 'Number':
					if (item.rangeSelectedFn === 'in') {
						return {
							fieldName: item.columnName,
							fieldShow: item.column,
							filterEndValue: item.rangeResultInEnd,
							filterStartValue: item.rangeResultInStart,
							symbolEnd: 'lessThan',
							symbolStart: 'moreThanThe',
							type: item.columnType,
						};
					} else {
						return {
							fieldName: item.columnName,
							fieldShow: item.column,
							filterEndValue: '',
							filterStartValue: item.rangeResult,
							symbolEnd: '',
							symbolStart: item.rangeSelectedFn,
							type: item.columnType,
						};
					}
				case 'Date':
					return {
						fieldName: item.columnName,
						fieldShow: item.column,
						filterEndValue: item.endTime,
						filterStartValue: item.startTime,
						symbolEnd: 'lessThan',
						symbolStart: 'moreThanThe',
						type: item.columnType,
					};
				default:
					return {
						fieldName: item.columnName,
						fieldShow: item.column,
						filterEndValue: '',
						filterStartValue: '',
						symbolEnd: '',
						symbolStart: '',
						type: item.columnType,
					};
			}
		});
		this.setState({
			dropDatas: {
				veidoos: [...veidoos],
				targets: [...targets],
				filterParams: [...filterParams],
			},
		});
	};

	// 新增字段弹窗点击确定按钮
	handleConfirm = (val: IFormVal) => {
		const { measureData } = this.state;
		const newMeasure = {
			column: val.filter,
			columnName: val.name,
			columnType: 'Number',
			countType: ECountType.sum,
			type: 'measure',
		};
		const newData = [...measureData, newMeasure];
		const newQueryFields = this.transToQuerySchema(
			newData,
			this.state.dimensionData
		);
		this.setState({
			measureData: [...newData],
			querySchemas: newQueryFields,
		});
		this.closeModal();
	};

	// 监听图表展现形式切换
	typeChange = (type: IShowType) => {
		this.setState({
			showType: type,
		});
	};

	// 进行图表查询
	queryData = async () => {
		const {
			querySql,
			sourceSql,
			queryStartTime,
			queryEndTime,
			timeType,
		} = this.props.location.state;
		const { dropDatas, measureData, dimensionData } = this.state;
		const newArr: ITagItem[] = [...measureData, ...dimensionData].map(
			(item) => {
				return {
					table: item.table,
					column: item.column,
					columnName: item.columnName,
					columnType: item.type as string,
					type: item.columnType,
				};
			}
		);
		this.setState({
			queryLoading: true,
		});
		try {
			const res = await getQueryData({
				dataSchemaList: newArr,
				querySql,
				sourceSql,
				startTime: queryStartTime,
				endTime: queryEndTime,
				timeType,
				runParamVo: dropDatas,
			});
			if (res) {
				const { dataSchemaList, datas } = res;
				this.setState((state) => {
					return {
						dataSchema: [...dataSchemaList],
						datas: [...datas],
						queryRowLength: state.dropDatas.veidoos.length,
						queryColumnLength: state.dropDatas.targets.length,
					};
				});
			}
		} catch (error) {
			console.log(error);
		} finally {
			this.setState({
				queryLoading: false,
			});
		}
	};

	// 关闭保存弹窗
	closeDialog = () => {
		this.setState({
			showDialog: false,
		});
	};

	render() {
		const {
			showType,
			datas,
			dataSchema,
			measureData,
			dimensionData,
			modalFields,
			querySchemas,
			queryLoading,
			queryRowLength,
			queryColumnLength,
		} = this.state;

		return (
			<div className={prefix}>
				<div className={`${prefix}-header`}>
					<div className="title">多维分析</div>
					<div className="handle">
						<Button style={{ marginRight: '12px' }} onClick={this.saveAsReport}>
							保存为报表
						</Button>
						<Button
							style={{ marginRight: '12px' }}
							onClick={this.saveAsDashboard}
						>
							保存为仪表盘
						</Button>
					</div>
					<span className="close" onClick={this.back}></span>
				</div>
				<Spin spinning={queryLoading}>
					<DndProvider backend={HTML5Backend}>
						<div className={`${prefix}-body`}>
							<div className={`${prefix}-left`}>
								<Dimension data={dimensionData} />
								<Measure data={measureData} />
								<div className="newFields" onClick={this.addNewField}>
									<span className="add-icon"></span>新增计算字段
								</div>
							</div>
							<div className={`${prefix}-main`}>
								<div className={`${prefix}-drop-area`}>
									<DropArea
										querySchemas={querySchemas}
										queryParams={this.props.location.state}
										filedChange={this.dropFieldsChange}
									/>
								</div>
								<div className={`${prefix}-chart`}>
									<Dashboard
										type={showType}
										datas={datas}
										selectDataSchema={dataSchema}
										rowLength={queryRowLength}
										columnLength={queryColumnLength}
									/>
								</div>
							</div>
							<div className={`${prefix}-right`}>
								<ConvertType
									onTypeChange={this.typeChange}
									handleQuery={this.queryData}
								/>
							</div>
						</div>
					</DndProvider>
				</Spin>
				<Modal
					title="新增计算字段"
					visible={this.state.modalVisible}
					maskClosable={false}
					footer={null}
					// onOk={this.handleOk}
					onCancel={this.closeModal}
				>
					{this.state.modalVisible && (
						<AddNewFieldModal
							fields={[...modalFields]}
							queryParams={this.props.location.state}
							onConfirm={this.handleConfirm}
						/>
					)}
				</Modal>
				{this.state.showDialog && (
					<CommonDialog
						visible={this.state.showDialog}
						type={this.state.dialogType}
						onClose={this.closeDialog}
					/>
				)}
			</div>
		);
	}
}
