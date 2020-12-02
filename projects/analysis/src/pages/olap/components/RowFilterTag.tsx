import React from 'react';
import { Tag } from 'antd';

// const BG = {
//   row: '#FFD9AF',
//   column: '#D0E2FF',
//   Filter: '#A6CFBA'
// };

interface IRowFilterTagProps {
	text: string;
	onClose?: (e: React.MouseEvent<HTMLElement>) => void;
}

interface IRowFilterTagState {}

export default class RowFilterTag extends React.Component<
	IRowFilterTagProps,
	IRowFilterTagState
> {
	closeItem = (e: React.MouseEvent<HTMLElement>) => {
		if (this.props.onClose) {
			this.props.onClose(e);
		}
	};

	render() {
		const { text } = this.props;
		return (
			<Tag
				className="filterItem"
				closable={true}
				color="#FFD9AF"
				style={{ color: '#000' }}
				onClose={this.closeItem}
			>
				{text}
			</Tag>
		);
	}
}
