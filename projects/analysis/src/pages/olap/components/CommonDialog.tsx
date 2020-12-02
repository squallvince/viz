import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Select } from "antd";
import React from "react";
import {
  downLoadCsv,
  IDashboardRequest,
  reqDashboardList,
  saveDashboard,
  saveReport,
} from "../../../service/search";

const FormItem = Form.Item;
const Option = Select.Option;

export interface ICommonDialogProps {
  visible: boolean;
  type: string;
  queryParams: {
    querySql: string,
    startTime?: string,
    endTime?: string,
    timeType?: string,
    selectColumns?: string
  },
  onClose: () => void;
}

export interface IDashboardItem {
  id: string | number;
  name: string;
}

export interface ICommonDialogState {
  loading: boolean;
  isNew: boolean;
  dashboardList: IDashboardItem[];
}

export interface IFormVals {
  tableName?: string;
  tableDec?: string;
  dashboard?: string | number;
  dashboardName?: string;
  dashboardDec?: string;
}

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

export default class CommonDialog extends React.Component<
  ICommonDialogProps,
  ICommonDialogState
> {
  constructor(props: ICommonDialogProps) {
    super(props);
    this.state = {
      loading: false,
      isNew: true,
      dashboardList: [],
    };
  }

  formRef = React.createRef<any>();

  componentDidMount() {
    // 获取已有的仪表盘列表
    this.getDashboardList();
  }

  // 获取仪表盘列表
  getDashboardList = async () => {
    this.setState({
      loading: true,
    });
    try {
      const res = await reqDashboardList();
      if (res) {
        this.setState({
          dashboardList: [...res],
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };

  // 点击新建按钮
  newDashboard = () => {
    this.setState({
      isNew: true,
    });
    this.formRef.current.setFieldsValue({ dashboard: "已有" });
  };

  // 选择已有dashboard
  oldDashboard = (value: string) => {
    this.setState({
      isNew: value === "已有",
    });
  };

  // 渲染表单内容
  renderFormByType = () => {
    const { type } = this.props;
    const { isNew, dashboardList } = this.state;
    switch (type) {
      case "csv":
        return <div>数据超过10000条，确认继续导出？</div>;
      case "table":
        return (
          <>
            <FormItem
              name="tableName"
              label="报表名称"
              rules={[{ required: true, message: "请输入报表名称" }]}
            >
              <Input placeholder="请输入名称" />
            </FormItem>
            <FormItem name="tableDec" label="报表描述">
              <Input.TextArea placeholder="请输入描述" rows={3} />
            </FormItem>
          </>
        );
      case "chart":
        return (
          <>
            <FormItem label="仪表盘">
              <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                  icon={<PlusOutlined />}
                  type={isNew ? "primary" : "default"}
                  style={{ width: "84px" }}
                  onClick={this.newDashboard}
                >
                  新建
                </Button>
                <FormItem name="dashboard" style={{ marginBottom: 0 }}>
                  <Select
                    style={{
                      width: "84px",
                      textAlign: "center",
                      background: isNew ? "" : "#177ddc",
                    }}
                    onSelect={this.oldDashboard}
                  >
                    {dashboardList.map((item: IDashboardItem) => {
                      return (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      );
                    })}
                  </Select>
                </FormItem>
              </div>
            </FormItem>
            {isNew && (
              <FormItem
                name="dashboardName"
                label="仪表盘名称"
                rules={[{ required: true, message: "请输入仪表盘名称" }]}
              >
                <Input placeholder="请输入名称" />
              </FormItem>
            )}
            <FormItem name="dashboardDec" label="仪表盘描述">
              <Input placeholder="请输入描述" />
            </FormItem>
          </>
        );
      default:
        return <div></div>;
    }
  };

  renderTitle = () => {
    const { type } = this.props;
    switch (type) {
      case "csv":
        return "确认导出？";
      case "table":
        return "保存为报表";
      case "chart":
        return "保存为仪表盘";
      default:
        return "弹窗";
    }
  };

  // 提交表单
  onSubmit = async (values: IFormVals) => {
    console.log(values);
    const { isNew } = this.state;
    const { queryParams } = this.props;
    this.setState({
      loading: true,
    });
    let reqParams: IDashboardRequest = { panels: [] };
    try {
      if (this.props.type === "chart") {
        if (isNew) {
          reqParams.name = values.dashboardName as string;
          reqParams.describe = values.dashboardDec;
          reqParams.panels?.push({name: values.dashboardName as string});
        } else {
          reqParams.id = values.dashboard;
          reqParams.panels?.push({name: values.dashboard as string, sqlText: this.props.querySql})
        }
        await saveDashboard(reqParams);
        message.success("操作成功");
        this.setState({
          loading: false,
        });
        this.props.onClose();
      } else if (this.props.type === "table") {
        const { tableDec, tableName } = values;
        await saveReport({
          name: tableName as string,
          describe: tableDec,
          querySql: queryParams.querySql
        });
        message.success("操作成功");
        this.setState({
          loading: false,
        });
        this.props.onClose();
      }else if(this.props.type === "csv"){
        const downloadUrl = await downLoadCsv({
          ...queryParams
        })
        // 创建元素
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download="file.csv";
        document.body.appendChild(link);

        // 触发click才能下载
        link.click();
        // 移除
        document.body.removeChild(link);
        setTimeout(() => {
          this.setState({
            loading: false,
          });
          this.props.onClose();
        }, 500);
      }
    } catch (error) {
      console.log(error.code);
      this.setState({
        loading: false
      })
    }
  };

  render() {
    const { visible, type } = this.props;

    return (
      <Modal
        title={this.renderTitle()}
        visible={visible}
        destroyOnClose={true}
        maskClosable={false}
        footer={[
          <Button
            key="confirm"
            type="primary"
            loading={this.state.loading}
            onClick={() => {
              this.formRef.current.submit();
            }}
          >
            {type === "csv" ? "导出" : "保存"}
          </Button>,
        ]}
        onCancel={() => {
          if (this.state.loading) return;
          this.props.onClose();
        }}
      >
        <Form
          {...formLayout}
          ref={this.formRef}
          onFinish={this.onSubmit}
          initialValues={{ dashboard: "已有" }}
        >
          {this.renderFormByType()}
        </Form>
      </Modal>
    );
  }
}
