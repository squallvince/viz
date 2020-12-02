import React, { useState } from 'react';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import { ECountType, IDragItem } from './components/DragTag';
import 'less/olap/dropArea.less';
import ColumnFilterTag from './components/ColumnFilterTag';
import RowFilterTag from './components/RowFilterTag';

import _ from 'lodash';
import { message } from 'antd';
import SubFilterTag from './components/SubFilterTag';
import { ITagItem } from './Dimension';
import { IOlapQueryParams } from './index';

interface IMenuItemClickInfo {
	key: React.Key;
	keyPath: React.Key[];
	item: React.ReactInstance;
	domEvent: React.MouseEvent<HTMLElement>;
}

export interface IDataParams {
	row: IDragItem[];
	column: IDragItem[];
	filter: IFilterItem[];
}

export interface IDropAreaProps {
	filedChange?: (type: string, datas: IDataParams) => void;
	querySchemas: ITagItem[];
	queryParams: IOlapQueryParams;
}

export interface IFilterItem extends IDragItem {
	selectedKey?: string;
	rangeSelectedFn?: string;
	rangeResultInEnd?: string;
	rangeResultInStart?: string;
	rangeResult?: string;
	startTime?: string;
	endTime?: string;
	type: symbol | string;
}

const prefix = 'CDropArea';
// export default React.forwardRef();
export default (props: IDropAreaProps) => {
	const [rowData, setRowData] = useState<IDragItem[]>([]);
	const [columnData, setColumnData] = useState<IDragItem[]>([]);
	const [filterData, setFilterData] = useState<IFilterItem[]>([]);

	const [{ rowIsOver, rowCanDrop }, rowDrop] = useDrop({
		accept: ['dimension', 'measure'],
		drop: (data: IDragItem, monitor: DropTargetMonitor) => {
			const hasFLag = _.findIndex(rowData, (o) => o.column === data.column);
			if (hasFLag < 0) {
				setRowData([...rowData, data]);
			} else {
				data.column = _.uniqueId(data.column + '&');
				setRowData([...rowData, data]);
			}
			if (props.filedChange) {
				props.filedChange('row', {
					row: [...rowData, data],
					column: columnData,
					filter: filterData,
				});
			}
			return { dropType: 'copy' };
		},
		collect: (monitor) => ({
			rowIsOver: monitor.isOver(),
			rowCanDrop: monitor.canDrop(),
		}),
	});

	const [{ columnIsOver, columnCanDrop }, columnDrop] = useDrop({
		accept: ['dimension', 'measure'],
		drop: (data: IDragItem, monitor: DropTargetMonitor) => {
			const hasFLag = _.findIndex(columnData, (o) => o.column === data.column);
			if (hasFLag < 0) {
				setColumnData([...columnData, data]);
			} else {
				data.column = _.uniqueId(data.column + '&');
				setColumnData([...columnData, data]);
			}
			if (props.filedChange) {
				props.filedChange('column', {
					row: rowData,
					column: [...columnData, data],
					filter: filterData,
				});
			}

			return { dropType: 'copy' };
		},
		collect: (monitor) => ({
			columnIsOver: monitor.isOver(),
			columnCanDrop: monitor.canDrop(),
		}),
	});

	const [{ filterIsOver, filterCanDrop }, filterDrop] = useDrop({
		accept: ['dimension', 'measure'],
		drop: (data: IDragItem, monitor: DropTargetMonitor) => {
			const hasFLag = _.findIndex(filterData, (o) => o.column === data.column);
			if (hasFLag < 0) {
				setFilterData([...filterData, data]);
			} else {
				message.info('筛选条件不可重复添加');
			}
			if (props.filedChange) {
				props.filedChange('filter', {
					row: rowData,
					column: columnData,
					filter: [...filterData, data],
				});
			}
			return { dropType: 'copy' };
		},
		collect: (monitor) => ({
			filterIsOver: monitor.isOver(),
			filterCanDrop: monitor.canDrop(),
		}),
	});

	/**
	 *
	 * baclona
	 * 过滤器API start
	 */
	const rowFilterTagClose = (
		e: React.MouseEvent<HTMLElement>,
		index: number | string
	) => {
		setRowData((prevRow) => {
			const newRow = prevRow.filter((item) => item.column !== index);

			if (props.filedChange) {
				props.filedChange('row', {
					row: newRow,
					column: columnData,
					filter: filterData,
				});
			}
			return [...newRow];
		});
	};

	// 列tags删除事件
	const columnFilterTagClose = (
		e: React.MouseEvent<HTMLElement>,
		index: number | string
	) => {
		setColumnData((prevColumn) => {
			const newColumns = prevColumn.filter((item) => item.column !== index);
			if (props.filedChange) {
				props.filedChange('column', {
					row: rowData,
					column: newColumns,
					filter: filterData,
				});
			}
			return [...newColumns];
		});
	};

	// 列tags选择事件
	const columnFilterTagSelected = (
		info: IMenuItemClickInfo,
		column?: string
	) => {
		if (props.filedChange) {
			const columnCopy = columnData.map((item) => {
				if (item.column === column) {
					return {
						...item,
						countType: info.key as ECountType,
					};
				} else {
					return { ...item };
				}
			});
			setColumnData([...columnCopy]);
			props.filedChange('column', {
				row: rowData,
				column: [...columnCopy] as IDragItem[],
				filter: filterData,
			});
		}
	};

	// 筛选tag删除事件
	const subFilterTagClose = (
		e: React.MouseEvent<HTMLElement>,
		index: number | string
	) => {
		setFilterData((prevFilter) => {
			const newfilters = prevFilter.filter((item) => item.column !== index);
			if (props.filedChange) {
				props.filedChange('filter', {
					row: rowData,
					column: columnData,
					filter: newfilters,
				});
			}
			return [...newfilters];
		});
	};

	// 筛选tag方法变更事件
	const subFilterTagVisibleChange = (result: any) => {
		console.log('过滤筛选器显示/隐藏切换事件', result);
		const {
			column,
			stringSelectedKeys,
			type,
			startTime,
			endTime,
			rangeResult,
			rangeSelectedFn,
			rangeResultInStart,
			rangeResultInEnd,
		} = result;
		if (props.filedChange) {
			const newfilters: IFilterItem[] = filterData.map((item) => {
				if (item.column === column) {
					switch (type) {
						case 'String':
							return {
								...item,
								selectedKey: stringSelectedKeys.join(','),
								type,
							};
						case 'Date':
							return {
								...item,
								startTime,
								endTime,
							};
						case 'Number':
							return {
								...item,
								rangeResult,
								rangeSelectedFn,
								rangeResultInStart,
								rangeResultInEnd,
							};
						default:
							return {
								...item,
							};
					}
				} else {
					return { ...item };
				}
			});
			setFilterData([...newfilters]);
			props.filedChange('filter', {
				row: rowData,
				column: columnData,
				filter: newfilters,
			});
		}
	};

	/**
	 * 过滤器API end
	 */

	return (
		<div className={prefix}>
			<div
				className={`${prefix}-row`}
				style={rowCanDrop ? { border: '1px dashed #565656' } : {}}
				ref={rowDrop}
			>
				<div className="title">行</div>
				<div className="content">
					{rowData.length > 0 &&
						rowData.map((item: IDragItem, index: number) => {
							return (
								<RowFilterTag
									key={item.column}
									text={item.columnName}
									onClose={(e) => {
										rowFilterTagClose(e, item.column);
									}}
								/>
							);
						})}
					{(!rowData || rowData.length === 0) && (
						<>
							可拖拽<span>维度</span>或<span>指标</span>至此区域
						</>
					)}
				</div>
			</div>
			<div
				className={`${prefix}-column`}
				style={columnCanDrop ? { border: '1px dashed #565656' } : {}}
				ref={columnDrop}
			>
				<div className="title">列</div>
				<div className="content">
					{columnData.length > 0 &&
						columnData.map((item: IDragItem, index: number) => {
							return (
								<ColumnFilterTag
									key={item.column}
									column={item.column}
									text={item.columnName}
									onClose={(e) => {
										columnFilterTagClose(e, item.column);
									}}
									onSelected={columnFilterTagSelected}
								/>
							);
						})}
					{(!columnData || columnData.length === 0) && (
						<>
							可拖拽<span>维度</span>或<span>指标</span>至此区域
						</>
					)}
				</div>
			</div>
			<div
				className={`${prefix}-filter`}
				style={filterCanDrop ? { border: '1px dashed #565656' } : {}}
				ref={filterDrop}
			>
				<div className="title">筛选</div>
				<div className="content">
					{filterData.length > 0 &&
						filterData.map((item: IDragItem, index: number) => {
							return (
								<SubFilterTag
									key={item.column}
									text={item.columnName}
									type={item.columnType}
									column={item.column}
									querySchemas={props.querySchemas}
									queryParams={props.queryParams}
									onClose={(e) => {
										subFilterTagClose(e, item.column);
									}}
									onVisibleChange={subFilterTagVisibleChange}
								/>
							);
						})}
					{(!filterData || filterData.length === 0) && (
						<>
							可拖拽<span>维度</span>或<span>指标</span>至此区域进行筛选
						</>
					)}
				</div>
			</div>
		</div>
	);
};
