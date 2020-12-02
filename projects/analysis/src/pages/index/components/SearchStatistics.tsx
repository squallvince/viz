import React, { Component } from 'react';
import { Table, Pagination } from 'antd';
import 'less/SearchStatistics.less';

interface ISearchStatisticsProps {
    dataSource: Array<any>,
    columns: Array<any>,
    total: number,
    onPageChange: Function
}

interface ISearchStatisticsState {
    pageNumber: number,
    pageSize: number
}

class SearchStatistics extends Component<ISearchStatisticsProps, ISearchStatisticsState> {

    get scrollHeight() {
        const clientHeight = document.documentElement.clientHeight - 380;
        return clientHeight < 500 ? 500 : clientHeight;
    }

    get scrollWidth() {
        const { columns } = this.props;
        return columns.length * 200;
    }

    constructor(props: ISearchStatisticsProps) {
        super(props);
    }

    onChange = (pageNumber: number, pageSize?: number) => {
        this.props.onPageChange(pageNumber, pageSize);
    }

    render() {
        const { dataSource, columns, total } = this.props;
        return (
            <div className="search-statistics">
                <div className="search-statistics-table">
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        pagination={false}
                        scroll={{ x: this.scrollWidth }}
                        // scroll={{ x: this.scrollWidth, y: this.scrollHeight }}
                    />
                </div>
                <div className="search-statistics-pagination">
                    <Pagination
                        showQuickJumper
                        total={total}
                        onChange={this.onChange}
                    />
                </div>
            </div>
        );
    }
}

export default SearchStatistics;