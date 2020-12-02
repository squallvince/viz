import React from 'react';
import 'less/olap/NewFieldFormSelect.less';
import { IColumnSchema } from '..';

interface ISelectValue {
	name?: string;
	filter?: string;
}

interface IPros {
	fields: IColumnSchema[];
	value?: ISelectValue;
	onChange?: (value: ISelectValue) => void;
	onSelectedName: (param: string | object) => void;
	onSelectedFilter: (param: string | object) => void;
}

interface IState {
	name?: string;
	filter?: string;
}

export enum EFuncType {
	'AVG()' = 'avg',
	'COUNT()' = 'count',
	'SUM()' = 'sum',
	'FIRST()' = 'first',
	'LAST()' = 'last',
	'MAX()' = 'max',
	'MIN()' = 'min',
	'STDDEV()' = 'stddev',
	'STDDEVSAMP()' = 'stddevSamp',
	'VARPOP()' = 'varPop',
	'VARSAMP()' = 'varSamp',
}

const rights = [
	{ key: EFuncType['AVG()'], value: 'AVG()' },
	{ key: EFuncType['COUNT()'], value: 'COUNT()' },
	{ key: EFuncType['FIRST()'], value: 'FIRST()' },
	{ key: EFuncType['LAST()'], value: 'LAST()' },
	{ key: EFuncType['MAX()'], value: 'MAX()' },
	{ key: EFuncType['MIN()'], value: 'MIN()' },
	{ key: EFuncType['STDDEV()'], value: 'STDDEV()' },
	{ key: EFuncType['STDDEVSAMP()'], value: 'STDDEVSAMP()' },
	{ key: EFuncType['SUM()'], value: 'SUM()' },
	{ key: EFuncType['VARPOP()'], value: 'VARPOP()' },
	{ key: EFuncType['VARSAMP()'], value: 'VARSAMP()' },
];

export default class NewFieldFormSelect extends React.Component<IPros, IState> {
	constructor(props: IPros) {
		super(props);
		this.state = {
			name: '',
			filter: '',
		};
	}

	handleClickName = (param: string | object) => {
		this.props.onSelectedName(param);
	};

	handleClickFilter = (param: string | object) => {
		this.props.onSelectedFilter(param);
	};

	render() {
		const { fields } = this.props;

		return (
			<div className="formSelectCustom">
				<div className="formSelectCustom-left">
					{fields.map((item, i) => {
						return (
							<div
								key={item.column}
								onClick={() => {
									this.handleClickName(item);
								}}
							>
								<span>{item.type}</span>
								<span>{item.columnName}</span>
							</div>
						);
					})}
				</div>
				<div className="formSelectCustom-right">
					{rights.map((item) => {
						return (
							<div
								key={item.key}
								onClick={() => {
									this.handleClickFilter(item.value);
								}}
							>
								<span>{item.value}</span>
							</div>
						);
					})}
				</div>
			</div>
		);
	}
}
