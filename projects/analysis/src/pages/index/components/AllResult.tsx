import React from "react";
import { Badge, Table } from "antd";
import {
  Key,
  SorterResult,
  TableCurrentDataSource,
  TablePaginationConfig,
} from "antd/lib/table/interface";
import "less/allResult.less";

export interface IColumnsItem {
  key: string | number;
  [prop: string]: any;
}

export interface ITableDataItem {
  [prop: string]: any;
}

export interface IResultPagination {
  current: number;
  pageSize: number;
  total: number;
}

interface IAllResultProps {
  columns: IColumnsItem[];
  data: ITableDataItem[];
  pagination: IResultPagination;
  loading?: boolean;
  showType: "table" | "list";
  pageChange?: (pagination: IResultPagination) => void;
}

interface IAllResultState {
  ownColumns: IColumnsItem[];
}

const prefix: string = "CAllResult";

export default class AllResult extends React.Component<
  IAllResultProps,
  IAllResultState
> {
  get scrollWidth() {
    const { columns } = this.props;
    return columns.length * 200;
  }

  constructor(props: IAllResultProps) {
    super(props);
    this.state = {
      ownColumns: [],
    };
  }

  static getDerivedStateFromProps(
    props: IAllResultProps,
    state: IAllResultState
  ) {
    const { columns, showType } = props;
    if (showType === "table") {
      return {
        ownColumns: [...columns],
      };
    } else {
      const timeColumn = columns.filter(
        (item: IColumnsItem) => item.key === "_time"
      );
      timeColumn.push({
        dataIndex: "composeField",
        key: "composeField",
        title: "composeField",
        render: (text: any, record: ITableDataItem, index: number) => {
          let strArr: string[] = [];
          for (let value of Object.values(record)) {
            strArr.push(`${value}`);
          }
          return (
            <div className={`${prefix}-composeRow`} title={strArr.join(",")}>
              <p className="text">{strArr.join(",")}</p>
              <div className="fields">
                {Object.keys(record).map((item: string) => {
                  return (
                    <Badge
                      key={item}
                      style={{ marginRight: "20px" }}
                      color="#808388"
                      text={
                        <span style={{ color: "#808388" }}>
                          {`${item} = ${record[item]}`}
                        </span>
                      }
                    />
                  );
                })}
              </div>
            </div>
          );
        },
      });
      return {
        ownColumns: [...timeColumn],
      };
    }
  }

  tableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, Key[] | null>,
    sorter: SorterResult<ITableDataItem> | SorterResult<ITableDataItem>[],
    extra: TableCurrentDataSource<ITableDataItem>
  ) => {
    const { action } = extra;
    const { pageChange } = this.props;
    switch (action) {
      case "paginate":
        if (pageChange) {
          pageChange({
            ...(pagination as IResultPagination),
          });
        }
        break;
      case "sort":
        break;
      case "filter":
        break;
      default:
        break;
    }
  };

  render() {
    const { showType, data, pagination } = this.props;
    const { ownColumns } = this.state;

    return (
      <div className={prefix}>
        <Table
          rowKey={(row: ITableDataItem) => {
            return row.key;
          }}
          columns={ownColumns}
          dataSource={data}
          scroll={showType === "table" ? { x: this.scrollWidth } : {}}
          pagination={{ ...pagination, showQuickJumper: true }}
          onChange={this.tableChange}
        />
      </div>
    );
  }
}
