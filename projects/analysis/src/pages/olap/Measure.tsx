import React, { useEffect, useRef, useState } from 'react';
import { DragTag, IDragItem } from './components/DragTag';
import 'less/olap/measure.less';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import _ from 'lodash';
import { ITagItem } from './Dimension';

export interface IMeasureState {
	tags: ITagItem[];
	showShadow: boolean;
}

export interface IMeasureProps {
	data: ITagItem[];
}

const prefix = 'CMeasure';

export default (props: IMeasureProps) => {
	const [showShadow, setShowShadow] = useState<boolean>(false);
	const [tags, setTags] = useState<ITagItem[]>([]);
	const scrollRef = useRef<HTMLDivElement>({} as HTMLDivElement);

	const [{ isOver, canDrop }, drop] = useDrop({
		accept: 'dimension',
		drop: (data: IDragItem, monitor: DropTargetMonitor) => {
			data.type = 'measure';
			if (!data.columnType) {
				data.columnType = 'number';
			}
			const currentTags = [...tags];
			currentTags.push(data as ITagItem);
			setTags(currentTags);
			return { dropType: 'move' };
		},
		collect: (monitor) => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop(),
		}),
	});

	useEffect(() => {
		setTags(props.data as ITagItem[]);
		setShowShadow(props.data.length > 5);
	}, [props.data.length]);

	const scroll = () => {
		if (!scrollRef) return;
		const scrollTop = scrollRef.current.scrollTop;
		const clientHeight = scrollRef.current.clientHeight;
		const scrollHeight = scrollRef.current.scrollHeight;
		if (scrollHeight - (clientHeight + scrollTop) <= 10) {
			setShowShadow(false);
		} else {
			setShowShadow(true);
		}
	};

	const handleTag = (handleType: 'move' | 'copy', tagInfo: IDragItem) => {
		if (handleType === 'move') {
			const { column } = tagInfo;
			const tagsCopy = [...tags];
			const delIndex = _.findIndex(
				tagsCopy,
				(o: ITagItem) => o.column === column
			);
			tagsCopy.splice(delIndex, 1);
			setTags(tagsCopy);
		}
	};

	return (
		<div
			className={`${prefix} ${showShadow ? 'showShadow' : ''} ${
				canDrop ? 'canDrop' : ''
			}`}
			ref={drop}
		>
			<div className={`${prefix}-title`}>
				<span className="icon"></span>
				度量
			</div>
			<div className={`${prefix}-content`} ref={scrollRef} onScroll={scroll}>
				{tags.map((item: ITagItem) => {
					return (
						<DragTag
							key={item.column}
							name={item.columnName}
							column={item.column}
							columnType={item.columnType}
							countType={item.countType}
							dragType="measure"
							dropEnd={handleTag}
						/>
					);
				})}
			</div>
		</div>
	);
};
