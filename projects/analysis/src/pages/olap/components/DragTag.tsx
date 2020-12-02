import React, { FC, useState } from 'react';
import { DragSourceMonitor, useDrag } from 'react-dnd';
import 'less/olap/dragTag.less';
import {
	CalendarOutlined,
	EditOutlined,
	LoadingOutlined,
} from '@ant-design/icons';
import { Input, Menu, Tooltip } from 'antd';

export enum ECountType {
	avg = 'avg',
	count = 'count',
	sum = 'sum',
	first = 'first',
	last = 'last',
	max = 'max',
	min = 'min',
}

export const ConutTypeName = {
	[ECountType.avg]: '平均值',
	[ECountType.count]: '计数',
	[ECountType.sum]: '总计',
	[ECountType.first]: '第一个值',
	[ECountType.last]: '最后一个值',
	[ECountType.max]: '最大值',
	[ECountType.min]: '最小值',
};

export interface ICustomTagProps {
	style?: React.CSSProperties;
	column: string;
	name: string;
	columnType?: string;
	countType?: ECountType;
	dragType: string | symbol;
	dropEnd?: (handleType: 'move' | 'copy', tagInfo: IDragItem) => void;
}

export interface IDragItem {
	column: string;
	columnName: string;
	type: string | symbol;
	countType?: ECountType;
	columnType?: string;
	table?: string;
}

const prefix = 'CDragTag';
const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;

export const DragTag: FC<ICustomTagProps> = ({
	style,
	column,
	name,
	columnType,
	countType,
	dragType,
	dropEnd,
}) => {
	const [isEdit, setEdit] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [showMenu, setShowMenu] = useState<boolean>(false);

	const item = {
		column,
		columnName: name,
		type: dragType,
		countType,
		columnType,
	};
	const [{ opacity }, drag] = useDrag({
		item,
		end(item: IDragItem | undefined, monitor: DragSourceMonitor) {
			const dropResult = monitor.getDropResult();
			if (dropResult && item) {
				const { dropType } = dropResult;
				if (dropEnd) {
					dropEnd(dropType, item);
				}
			}
		},
		collect: (monitor: any) => ({
			opacity: monitor.isDragging() ? 0.4 : 1,
		}),
	});

	// 渲染类型图标
	const renderType = (type?: string) => {
		if (!type) return '';
		switch (type) {
			case 'string':
				return 'abc';
			case 'number':
				return '123';
			case 'date':
				return <CalendarOutlined />;
			default:
				return '';
		}
	};

	// 渲染菜单
	const renderMenu = (type?: string) => {
		if (!type) return '';
		const stringMenu = (
			<Menu onClick={menuClick} style={{ width: 150, background: '#33343C' }}>
				<MenuItem key="rename">重命名</MenuItem>
				<SubMenu key="changeType" title="更改数据类型" popupOffset={[10, 0]}>
					<MenuItem key="date">日期</MenuItem>
					<MenuItem key="string">字符</MenuItem>
					<MenuItem key="number">数字</MenuItem>
				</SubMenu>
			</Menu>
		);
		const numberMenu = (
			<Menu onClick={menuClick} style={{ width: 150, background: '#33343C' }}>
				<MenuItem key="rename">重命名</MenuItem>
				<SubMenu
					key="changeType"
					title="更改数据类型"
					popupClassName={`${prefix}-submenu`}
					popupOffset={[10, 0]}
				>
					<MenuItem key="date">日期</MenuItem>
					<MenuItem key="string">字符</MenuItem>
					<MenuItem key="number">数字</MenuItem>
				</SubMenu>
				<SubMenu
					key="changeCountType"
					title="更改默认汇总方式"
					popupClassName={`${prefix}-submenu`}
					popupOffset={[10, 0]}
				>
					{Object.keys(ConutTypeName).map((item: string) => {
						return (
							<MenuItem key={item}>
								{ConutTypeName[item as ECountType]}
							</MenuItem>
						);
					})}
				</SubMenu>
			</Menu>
		);
		switch (type) {
			case 'string':
			case 'date':
				return stringMenu;
			case 'number':
				return numberMenu;
			default:
				return '';
		}
	};

	// 隐藏菜单
	const hideMenu = () => {
		setShowMenu(false);
	};

	// 菜单按钮点击事件
	const menuClick = (e: any) => {
		if (!e || !e.key) return;
		const [key, subKey] = e.keyPath;
		if (key === 'rename') {
			setEdit(true);
		} else if (subKey === 'changeType') {
			// TODO:执行更改数据类型的操作，发送后端请求
		} else if (subKey === 'changeCountType') {
			// TODO:执行更改默认汇总方式的操作，发送后端请求
		} else {
			return;
		}
		setShowMenu(false);
	};

	// 输入框失去焦点事件
	const changeName = (e: React.FocusEvent<HTMLInputElement>) => {
		console.log(e.target.value);
		setLoading(true);
		setTimeout(() => {
			setEdit(false);
			setLoading(false);
		}, 1000);
	};

	return (
		<div
			ref={drag}
			className={prefix}
			style={style ? { ...style, opacity } : { opacity }}
		>
			<span className={`${prefix}-type`}>{renderType(columnType)}</span>
			{!isEdit && (
				<span className={`${prefix}-name`} title={name}>
					{name}
				</span>
			)}
			{isEdit && (
				<Input
					defaultValue={name}
					onBlur={changeName}
					suffix={loading ? <LoadingOutlined /> : ''}
				/>
			)}
			<span className={`${prefix}-edit`}>
				<Tooltip
					title={renderMenu(columnType)}
					trigger="click"
					placement="right"
					overlayClassName={`${prefix}-tooltip`}
				>
					<EditOutlined />
				</Tooltip>
			</span>

			{showMenu && (
				<div className={`${prefix}-menu`} onMouseLeave={hideMenu}>
					{renderMenu(columnType)}
				</div>
			)}
		</div>
	);
};
