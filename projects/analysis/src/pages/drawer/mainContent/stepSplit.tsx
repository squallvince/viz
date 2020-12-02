import * as React from 'react';
import { Tabs, Input, Table, Tooltip, Layout } from 'antd';
import { EditOutlined, LoginOutlined } from '@ant-design/icons';
// import 'less/index.less';
import splitData from '../contant';
import EditTable from '../../components/EditableTable';
import { BackInfoContext } from '../context';
const { TabPane } = Tabs;
export interface IStepSplitProps {
}
export interface EditKeys {
	key: number;
	t: string;
	eFlag: boolean;
}
export interface IStepSplitState {
	// splitStr: string;
	splitTypeArr: string[];
	otherSplit: string;
	splitDataSource: any[];
	splitColumns: any[];
	editKeys: any[];
	editValues: string[];
	editFlag: string;
	currentTab: string;
}
class StepSplit extends React.Component<IStepSplitProps, IStepSplitState> {
	static contextType = BackInfoContext;
	constructor(props: IStepSplitProps) {
		super(props);
		this.state = {
			// splitStr: '',
			splitTypeArr: ['Tab', '逗号', '空格', '其他'],
			otherSplit: '',
			editFlag: 'edit',
			splitDataSource: [],
			splitColumns: [],
			editKeys: [],
			editValues: [],
			currentTab: '其他'
		};
	}
	handleInput(e: any) {
		const val = e.target.value;
		this.setState({
			otherSplit: val,
			currentTab: '其他'
		}, () => {
			val === '' ? this.clearData() : this.extract(val);
		});
	}
	handleEdit = () => {
		if (this.state.currentTab === '其他' && this.state.otherSplit === '') {
			return
		}
		const { editKeys, editFlag } = this.state;
		const cannotEdit = editKeys.map(d => {
			return {
				...d,
				eFlag: false
			};
		});
		const isEditing = editKeys.map(d => {
			return {
				...d,
				eFlag: d.t === '' ? false : true
			};
		});
		this.setState({
			editFlag: editFlag === 'edit' ? 'save' : 'edit',
			editKeys: editFlag === 'edit' ? [...isEditing] : [...cannotEdit]
		}, () => {
			this.noticeParent();
		});
	}
	saveEditData = (data: string, index: number) => {
		const { editKeys, splitColumns } = this.state;
		const resultData = editKeys.map((d, i) => {
			return {
				...d,
				t: index === i ? data : d.t
			};
		});
		const newTableColumns = splitColumns.map((s, i) => {
			const resultField = i === index + 1 ? data : s.title;
			return {
				...s,
				title: resultField
			};
		});
		this.setState({
			editKeys: [...resultData],
			splitColumns: newTableColumns
		}, () => {
			this.noticeParent();
		});
	}
	delEditItem = (index: number) => {
		const { editKeys, splitColumns } = this.state;
		const newEditKeys = editKeys.map((d, i) => {
			return {
				...d,
				t: i === index ? '' : d.t,
				eFlag: (i === index) ? false : d.eFlag
			};
		});
		const newSplitColumns = splitColumns.map((c, i) => {
			return {
				title: i === index + 1 ? '' : c.title,
				dataIndex: i === index + 1 ? '' : c.dataIndex
			};
		});
		this.setState({
			editKeys: [...newEditKeys],
			splitColumns: newSplitColumns
		}, () => {
			this.noticeParent();
		});
	}
	extract = (type: string) => {
		const { sample, listData } = this.context;
		const splitStr = sample.data;
		const extractRes = splitStr.split(type);
		let editKeys: object[] = [];
		let editValues: string[] = [];
		let splitColumns: object[] = [{
			title: '-raw',
			dataIndex: 'raw',
			width: 300,
			// textWrap: 'word-break',
			// ellipsis: { showTitle: true }
		}];
		let splitDataSource: object[] = [];
		for (let i in extractRes) {
			const index = Number(i);
			let keyItem = {
				key: index,
				t: `field${index + 1}`,
				eFlag: false
			};
			let tableHeadItem = {
				title: `field${index + 1}`,
				dataIndex: `field${index + 1}`,
				width: 300,
				// textWrap: 'word-break',
				// ellipsis: { showTitle: true }
			};
			editKeys.push(keyItem);
			editValues.push(extractRes[i]);
			splitColumns.push(tableHeadItem);
		}
		for (let i = 0; i < listData.length; i++) {
			const dataItem = listData[i].data
			let splitRowItem: object = {};
			let originData: object = { key: i, raw: dataItem };
			let rowSplitData = dataItem.split(type);
			for (let j = 0; j < editKeys.length; j++) {
				let key: string = editKeys[j]['t'];
				splitRowItem[key] = rowSplitData[j];
			}
			splitDataSource.push({ ...originData, ...splitRowItem });
		}
		this.setState({
			editKeys,
			editValues,
			splitColumns,
			splitDataSource
		}, () => {
			this.noticeParent();
		});
	}
	reset = () => {
		if (this.state.currentTab === '其他' && this.state.otherSplit === '') {
			return
		}
		this.setState({
			editFlag: 'edit'
		})
		const splitType = this.transferTab(this.state.currentTab);
		this.extract(splitType);
	}
	changeTab = (c_tab: string) => {
		this.setState({
			currentTab: c_tab
		}, () => {
			if (c_tab === '其他' && this.state.otherSplit === '') {
				this.clearData();
			} else {
				const splitType = this.transferTab(c_tab);
				this.extract(splitType);
			}
		});
	}
	clearData = () => {
		this.setState({
			editKeys: [],
			editValues: [],
			splitColumns: [],
			splitDataSource: []
		}, () => {
			this.noticeParent();
		})
	}
	transferTab = (tab: string) => {
		let splitType: string | undefined;
		switch (tab) {
			case 'Tab':
				splitType = '	';
				break;
			case '逗号':
				splitType = ',';
				break;
			case '空格':
				splitType = ' ';
				break;
			case '其他':
				splitType = this.state.otherSplit;
				break;
			default:
				splitType = this.state.otherSplit;
		}
		return splitType;
	}
	componentDidMount() {
		if (this.context.split) {
			const { splitTab, splitInput, editKeys, editValues, splitColumns, splitDataSource } = this.context.split;
			this.setState({
				currentTab: splitTab,
				otherSplit: splitInput,
				editKeys,
				editValues,
				splitColumns,
				splitDataSource
			})
		} else {
			// this.extract(this.state.otherSplit);
		}
	}
	// 数据记录
	noticeParent = () => {
		const { currentTab, otherSplit, editKeys, editValues, splitColumns, splitDataSource } = this.state;
		const result = {
			splitTab: currentTab,
			splitInput: otherSplit,
			editKeys,
			editValues,
			splitColumns,
			splitDataSource
		}
		this.context.record({
			param: { type: 'split', split: result }
		});
	};
	render() {
		const { splitTypeArr, otherSplit, splitDataSource, splitColumns, editKeys, editValues, editFlag, currentTab } = this.state;
		const real_columns = splitColumns.filter(d => d.title !== '');
		return (
			<div className="field-split">
				<div className="split-tabs">
					<Tabs activeKey={currentTab} onChange={this.changeTab}>
						{splitTypeArr.map(i => (
							<TabPane tab={`${i}`} key={`${i}`}>
								<EditTable
									editKeys={editKeys}
									editValues={editValues}
									editFlag={editFlag}
									delEditItem={this.delEditItem}
									saveEditData={this.saveEditData}
								/>
								<Table dataSource={splitDataSource} columns={real_columns}
									pagination={false} scroll={{ x: 300 * real_columns.length, y: 240 }}></Table>
							</TabPane>
						))}
					</Tabs>
					<Input className="split-tab-input" value={otherSplit} onChange={(e) => this.handleInput(e)}></Input>
					<div className="handle-icons">
						<Tooltip placement="topLeft" title="重置" arrowPointAtCenter>
							<LoginOutlined onClick={this.reset} />
						</Tooltip>
						<Tooltip placement="topLeft" title={editFlag === 'edit' ? '编辑' : '保存'} arrowPointAtCenter>
							<EditOutlined onClick={this.handleEdit} style={{ color: editFlag === 'edit' ? '#979797' : '#5B7EE2' }} />
						</Tooltip>
					</div>
				</div>
			</div>
		);
	}
}
export default StepSplit;