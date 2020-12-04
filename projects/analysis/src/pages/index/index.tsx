import * as React from 'react';
import { Button, Spin, Tabs } from 'antd';
import Idrawer from '../drawer/index';
import IFieldsHandle, { IFieldObj } from './components/FieldsHandle';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import SearchStatistics from './components/SearchStatistics';
import Visualization from './components/Visualization';
import CommonDialog from './components/CommonDialog';
import WChart from './components/ChartBar';
import AllResult, {
	IColumnsItem,
	ITableDataItem,
	IResultPagination,
} from './components/AllResult';
import { downLoadCsv, ISchema, reqSearchData } from '../../service/search';
import { chartToVisua, transformToTHead } from './trans';
import { SearchInput } from 'components';
import { RouteComponentProps } from 'react-router';

export interface ISearchAppProps extends RouteComponentProps { }

export interface ISearchAppState {
	querySql: string;
	queryStartTime: string;
	queryEndTime: string;
	timeType: string;
	showDrawer: boolean;
	pagination: IResultPagination;
	sourceSql: string;
	choosedFields: IFieldObj[];
	currentFields: string[];
	currentTab: string;
	activeTableType: 'table' | 'list';
	isCountData: boolean;
	allResultState: {
		columns: IColumnsItem[];
		data: ITableDataItem[];
	};
	showDialog: boolean;
	dialogType: string;
	loading: boolean;
	originData: {
		selectDataSchema: IColumnsItem[];
		datas: IColumnsItem[];
	};
}
const TabPane = Tabs.TabPane;
const prefix: string = 'Psearch';
class SearchApp extends React.Component<ISearchAppProps, ISearchAppState> {
	constructor(props: ISearchAppProps) {
		super(props);
		this.state = {
			querySql: '',
			queryStartTime: '',
			queryEndTime: '',
			timeType: '',
			showDrawer: false,
			pagination: {
				current: 1,
				pageSize: 10,
				total: 0,
			},
			sourceSql: '',
			choosedFields: [],
			currentFields: [],
			currentTab: 'all',
			activeTableType: 'table',
			isCountData: false,
			allResultState: {
				columns: [],
				data: [],
			},
			dialogType: '',
			showDialog: false,
			loading: false,
			originData: {
				selectDataSchema: [],
				datas: [],
			},
		};
	}
  originType: string | null = '';
	chartType: string = 'Interval';
	/** baclona start */
	pageChange = (pageNumber: number, pageSize?: number) => {
		const { pagination } = this.state;
		this.setState(
			{
				pagination: {
					...pagination,
					current: pageNumber,
					pageSize: pageSize as number,
				},
			},
			() => {
				this.getSearchData();
			}
		);
	};
	/** baclona end */

	componentDidMount() {
		const searchParams = new URLSearchParams(this.props.location.search)
		this.originType = searchParams.get('from');
		// this.getSearchData();
	}

	// 性能优化
	shouldComponentUpdate(
		_nextProps: ISearchAppProps,
		nextState: ISearchAppState
	) {
		if (JSON.stringify(nextState) === JSON.stringify(this.state)) {
			return false;
		}
		return true;
	}

	// 获取数据
	getSearchData = async () => {
		const {
			pagination,
			queryStartTime,
			queryEndTime,
			timeType,
			isCountData,
		} = this.state;
		this.setState({
			loading: true,
		});
		try {
			const {
				sourceSql,
				dataSchema,
				selectDataSchema,
				datas,
				page,
				pageSize,
				count,
				statisticalFunction,
			} = await reqSearchData({
				querySql: this.state.querySql,
				selectColumns: isCountData ? '' : this.state.currentFields.join(','),
				startTime: queryStartTime,
				endTime: queryEndTime,
				timeType: timeType,
				page: pagination.current,
				pageSize: pagination.pageSize,
			});

			// 进行格式转换
			const schemaColumns = dataSchema.map((item: ISchema) => {
				return {
					label: item.column,
					value: item.column,
					disabled: item.column === 'time',
				};
			});
			const selectSchemaColums = selectDataSchema.map(
				(item: ISchema) => item.column
			);
			datas.forEach((row: ITableDataItem, index: number) => {
				row.key = index;
			});
			const columns = transformToTHead(selectDataSchema);

			this.setState({
				sourceSql: sourceSql,
				choosedFields: schemaColumns,
				currentFields: selectSchemaColums,
				pagination: {
					current: page,
					pageSize: pageSize,
					total: count,
				},
				currentTab: statisticalFunction ? 'count' : 'all',
				isCountData: Boolean(statisticalFunction),
				allResultState: {
					columns: columns,
					data: datas,
				},
				originData: {
					selectDataSchema: selectDataSchema,
					datas: datas,
				},
			});
		} catch (error) {
			console.log(error.code);
		} finally {
			this.setState({
				loading: false,
			});
		}
	};

	// 切换tab
	tabChange = (e: string) => {
		this.setState({
			currentTab: e,
		});
	};

	// 跳转到olap页面
	toOlapPage = () => {
		const {
			querySql,
			sourceSql,
			queryStartTime,
			queryEndTime,
			timeType,
		} = this.state;
		if (!sourceSql) return;
		this.props.history.push({
			pathname: '/analysis/olap',
			state: {
				querySql,
				sourceSql,
				queryStartTime,
				queryEndTime,
				timeType,
			},
		});
	};
  savePanel = () => {
		let dataSource: object = {};
		let visualizations: object = {};

		const { querySql, isCountData, currentFields, queryStartTime, queryEndTime, timeType, pagination} = this.state;
		const randomStr = Math.random().toString(36).slice(-8);
		const options: object = {
			querySql,
			selectColumns: isCountData ? '' : currentFields.join(','),
			startTime: queryStartTime,
			endTime: queryEndTime,
			timeType,
			page: pagination.current,
			pageSize: pagination.pageSize,
		}
		let ds_Key: string = `ds_${randomStr}`;
		let viz_key: string = `viz_${randomStr}`;
		dataSource[ds_Key] = {
      type: 'ds.search',
			options,
			query: '/api/v1.0/viz/datas',
			name: `Search_${randomStr}`
		}
		visualizations[viz_key] = {
			name: `Viz_${randomStr}`,
			type: `viz.${this.chartType}`,
			options: {
				hasPre: true,
        hasHistory: false,
        hasArea: false
			},
			dataSources: {
				primary: ds_Key
			}
		}
		const dashboardJson = JSON.parse(localStorage.getItem('dashboardJson'));
		dashboardJson.dataSources[ds_Key] = dataSource[ds_Key];
		dashboardJson.visualizations[viz_key] = visualizations[viz_key];
		localStorage.setItem('dashboardJson', JSON.stringify({ ...dashboardJson}));
	}
	renderExtra = () => {
		const { currentTab, activeTableType } = this.state;
		switch (currentTab) {
			case 'all':
				return (
					<div className={`${prefix}-tab-extra`}>
						<div className={`${prefix}-switch`}>
							<div
								className={`table ${activeTableType === 'table' ? 'active' : ''
									}`}
								title="表格展示"
								onClick={() => {
									this.switchType('table');
								}}
							></div>
							<div
								className={`list ${activeTableType === 'list' ? 'active' : ''}`}
								title="列表展示"
								onClick={() => {
									this.switchType('list');
								}}
							></div>
						</div>
						<Button onClick={this.toOlapPage} disabled={!this.state.sourceSql}>
							OLAP
						</Button>
					</div>
				);
			case 'count':
				return (
					this.originType === 'create' ?
						<div>
							<Button
								style={{ marginRight: '12px' }}
								onClick={() => this.openDialog('csv')}
							>
								导出CSV
						</Button>
							<Button
								style={{ marginRight: '12px' }}
								onClick={this.toOlapPage}
								disabled={!this.state.sourceSql}
							>
								OLAP
						</Button>
							<Button
								style={{ marginRight: '12px' }}
								onClick={() => this.openDialog('table')}
							>
								保存为报表
						</Button>
							<Button onClick={() => this.openDialog('chart')}>
								保存为仪表盘
						</Button>
						</div> :
						<div>
							<Button
								style={{ marginRight: '12px' }}
								onClick={() => this.openDialog('csv')}
							>
								保存并返回
              </Button>
						</div>
				);
			case 'view':
				return (
					this.originType === 'create' ?
						<div>
							<Button
								style={{ marginRight: '12px' }}
								onClick={() => this.savePanel()}
							>
								保存并返回
            </Button>
						</div> :
						<div>
							<Button
								style={{ marginRight: '12px' }}
								onClick={() => this.openDialog('csv')}
							>
								导出CSV
						  </Button>
							<Button
								style={{ marginRight: '12px' }}
								onClick={this.toOlapPage}
								disabled={!this.state.sourceSql}
							>
								OLAP
						  </Button>
							<Button
								style={{ marginRight: '12px' }}
								onClick={() => this.openDialog('table')}
							>
								保存为报表
						  </Button>
							<Button onClick={() => this.openDialog('chart')}>
								保存为仪表盘
						  </Button>
						</div>
				);
			default:
				return;
		}
	};

	// 切换列表的展现形式
	switchType = (type: 'table' | 'list') => {
		this.setState({
			activeTableType: type,
		});
	};

	// chart类型切换
	chartSwitch = (chartType: string) => {
		this.chartType = chartType;
	}

	// 点击按钮打开弹窗
	openDialog = async (type: string) => {
		const {
			pagination,
			currentFields,
			timeType,
			queryStartTime,
			queryEndTime,
			querySql,
		} = this.state;
		if (type === 'csv' && pagination.total < 10000) {
			if (querySql === '') return;
			try {
				const downloadUrl = await downLoadCsv({
					querySql,
					startTime: queryStartTime,
					endTime: queryEndTime,
					timeType: timeType,
					selectColumns: currentFields.join(','),
				});
				// 创建元素
				const link = document.createElement('a');
				link.href = downloadUrl;
				link.download = 'file.csv';
				document.body.appendChild(link);

				// 触发click才能下载
				link.click();
				// 移除
				document.body.removeChild(link);
			} catch (error) {
				console.log(error);
			}
			return;
		}
		this.setState({
			showDialog: true,
			dialogType: type,
		});
	};

	// 关闭弹窗
	closeDialog = () => {
		this.setState({
			showDialog: false,
		});
	};

	// 选择选定字段事件
	filedsChange = (e: CheckboxValueType[]) => {
		this.setState(
			{
				currentFields: e as string[],
			},
			() => {
				this.getSearchData();
			}
		);
	};

	// 选择猜你喜欢字段  已经砍掉  暂时注释
	// likeChange = (e: CheckboxValueType[]) => {
	//   console.log("like", e);
	//   // 根据选定的字段发送请求
	// };

	// 表格页码切换时
	searchData = (pagination: IResultPagination) => {
		this.setState(
			{
				pagination: {
					...pagination,
				},
			},
			() => {
				this.getSearchData();
			}
		);
	};
	// 获取Search后的数据
	getSearchResult = (str: any) => {
		const { querySql, startTime, endTime, timeType } = str;
		if (str) {
			this.setState(
				{
					querySql: querySql,
					queryStartTime: startTime,
					queryEndTime: endTime,
					timeType: timeType,
					currentFields: [],
				},
				() => {
					this.getSearchData();
				}
			);
		}
	};
	closeDrawer = (addColums: string[]) => {
		if (addColums && addColums.length > 0) {
			const { currentFields } = this.state;
			const newFields = [...currentFields, ...addColums];
			this.setState(
				{
					showDrawer: false,
					currentFields: [...newFields],
				},
				() => {
					this.getSearchData();
				}
			);
		} else {
			this.setState({
				showDrawer: false,
			});
		}
	};

	render() {
		const {
			querySql,
			showDrawer,
			pagination,
			choosedFields,
			currentFields,
			currentTab,
			activeTableType,
			isCountData,
			allResultState,
			dialogType,
			timeType,
			queryStartTime,
			queryEndTime,
			originData,
		} = this.state;

		return (
			<div className={prefix}>
				<div className={`${prefix}-bar`}>
					<SearchInput
						loading={this.state.loading}
						callback={this.getSearchResult}
					/>
				</div>
				<div className={`${prefix}-main`}>
					<Spin spinning={this.state.loading}>
						<Tabs
							tabBarExtraContent={this.renderExtra()}
							onChange={this.tabChange}
							activeKey={currentTab}
						>
							<TabPane tab="全部" key="all" disabled={isCountData}>
								<div className={`${prefix}-bar-chart`}>
									{this.state.querySql && (
										<WChart
											isReal={false}
											querySql={querySql}
											timeType={timeType}
											startTime={queryStartTime}
											endTime={queryEndTime}
										/>
									)}
								</div>
								<div className={`${prefix}-allContainer`}>
									<div className={`${prefix}-keyword`}>
										<IFieldsHandle
											choosedFields={choosedFields}
											currentChoose={currentFields}
											choosedFieldsChange={(e) => {
												this.filedsChange(e);
											}}
											openDrawer={() => {
												this.setState(
													{
														showDrawer: true,
													},
													() => {
														console.log(this.state);
													}
												);
											}}
										/>
									</div>
									<div className={`${prefix}-content`}>
										<AllResult
											{...allResultState}
											showType={activeTableType}
											pagination={{ ...pagination }}
											pageChange={this.searchData}
										/>
									</div>
								</div>
							</TabPane>
							<TabPane tab="统计数据" key="count" disabled={!isCountData}>
								<SearchStatistics
									dataSource={this.state.allResultState.data}
									columns={this.state.allResultState.columns}
									total={this.state.pagination.total}
									onPageChange={this.pageChange}
								/>
							</TabPane>
							<TabPane tab="可视化" key="view">
								<Visualization
									chartData={chartToVisua(originData)}
									searchData={this.state}
									onPreModalSubmit={() => {
										this.setState({ loading: true });
									}}
									onPreModalClose={() => {
										this.setState({ loading: false });
									}}
									onChartSwitch={this.chartSwitch}
								/>
							</TabPane>
						</Tabs>
					</Spin>
				</div>
				{this.state.showDrawer && (
					<Idrawer
						visibleFlag={showDrawer}
						page={pagination.current}
						pageSize={pagination.pageSize}
						sql={this.state.querySql}
						startTime={queryStartTime}
						endTime={queryEndTime}
						timeType={timeType}
						selectDataSchema={originData.selectDataSchema}
						selectColumns={currentFields}
						closeDrawer={this.closeDrawer}
					></Idrawer>
				)}

				{this.state.showDialog && (
					<CommonDialog
						visible={this.state.showDialog}
						type={dialogType}
						onClose={this.closeDialog}
						queryParams={{
							querySql: querySql,
							selectColumns: currentFields.join(','),
							startTime: queryStartTime,
							endTime: queryEndTime,
							timeType: timeType,
						}}
					/>
				)}
			</div>
		);
	}
}
export default SearchApp;
