import * as React from 'react';
import { Drawer, Layout, Button, message } from 'antd';
import ISteps from './steps';
import IContent from './Icontent';
import { BackInfoContext } from './context';
import 'less/drawer.less';
import { saveConfig } from '../../service/search';

const { Header, Footer, Content } = Layout;

export interface IDrawerProps {
  visibleFlag: boolean;
  page: number;
  pageSize: number;
  sql: string;
  startTime: string;
  endTime: string;
  timeType?: string;
  selectColumns: string[];
  selectDataSchema: object[];
  closeDrawer(): void;
}

export interface IDrawerState {
  currentStep: number;
  tab: string;
  page: number;
  activedItem: any;
  extractResult: any[];
  fieldName: string;
  disabledNext: boolean;
  splitResult: object;
  nextText: string;
  visible: boolean;
}
interface ISendbackInfo {
  step: number;
  param: any;
}

class Idrawer extends React.Component<IDrawerProps, IDrawerState> {
  state = {
    currentStep: 0,
    tab: 'regex',
    page: this.props.page,
    activedItem: '',
    extractResult: [],
    fieldName: '',
    disabledNext: true,
    splitResult: {},
    nextText: '下一步',
    visible: this.props.visibleFlag,
  };

  backInfo: { [k: string]: any } = {};

  static getDerivedStateFromProps(props: any, state: any) {
    // const { page, ...param } = props;
    return {
      ...state,
      visible: props.visibleFlag,
    };
  }
  // 处理不同步骤下的不同组件的返回信息
  record = (info: ISendbackInfo) => {
    const { param } = info;
    // if (
    //   Object.prototype.toString.call(param[param.type]) === '[Object Object]'
    // ) {
    // } else {
    //   this.backInfo[param.type] = param[param.type];
    // }
    this.backInfo[param.type] = param[param.type];

    switch (param.type) {
      case 'page':
        this.setState({
          page: param.page,
        });
        break;
      case 'sample':
        this.setState({
          activedItem: param.sample,
          disabledNext: !Boolean(param.sample.id),
        });
        break;
      case 'tab':
        this.setState({
          tab: param.tab,
        });
        break;
      case 'extract':
        this.setState({
          extractResult: param.extract.result,
          disabledNext: !(param.extract.result && Boolean(param.fieldName)),
        });
        break;
      case 'fieldName':
        this.setState({
          fieldName: param.fieldName,
          disabledNext: !(Boolean(param.fieldName) && this.backInfo.extract.result),
        });
        break;
      case 'split': // 分隔符提取
        this.setState({
          splitResult: param.split,
          disabledNext: !Boolean(param.split.editKeys.length > 1),
        });
        break;
      case 'saveParam': // 分隔符提取
        this.setState({
          disabledNext: !Boolean(param.saveParam.configName),
        });
        break;
      default:
      // this.backInfo.set(step, JSON.parse(JSON.stringify(info)));
    }
  };
  save = async () => {
    try {
      const { saveParam } = this.backInfo;
      const { currentStep } = this.state;
      const result = await saveConfig(saveParam);
      console.log('保存结果', result);
      message.success({
        content: '保存成功',
        className: 'custom-class',
        style: {
          marginTop: '20vh',
        },
      });
      this.setState({
        nextText: '完成',
        currentStep: currentStep + 1,
        disabledNext: false,
      });
    } catch (error) {
      console.log(error);
    }
  };
  // 跳转下一步
  nextStep = () => {
    const { currentStep, tab } = this.state;
    let max = tab === 'regex' ? 4 : 3;
    let flag = true;
    if (currentStep < max) {
      if (currentStep === 1 && tab === 'regex') {
        const { fieldName } = this.backInfo;
        if (fieldName) {
          flag = false;
        }
      }
      // 保存页面
      if (
        (currentStep === 3 && tab === 'regex') ||
        (currentStep === 2 && tab === 'split')
      ) {
        this.save();
      } else {
        this.setState({
          currentStep: currentStep + 1,
          disabledNext: flag,
        });
      }
    } else {
      const { tab, split, fieldName } = this.backInfo;
      let columnArr = [];
      if (tab === 'split') {
        split.editKeys.forEach((v) => v.t && columnArr.push(v.t));
      } else {
        columnArr.push(fieldName);
      }
      console.log(columnArr);
      this.onClose(columnArr);
      // this.getExtractResult();
    }
  };

  preStep = () => {
    const { currentStep } = this.state;
    if (currentStep > 0) {
      this.setState({
        currentStep: currentStep - 1,
        disabledNext: false,
      });
    }
  };
  onClose = (columnArr?: any[]) => {
    this.props.closeDrawer(columnArr);
  };
  componentDidMount() {
    this.setState({ page: this.context.page });
    // this.getExtractResult();
  }
  render() {
    const {
      currentStep,
      tab,
      page,
      disabledNext,
      nextText,
      visible,
    } = this.state;
    const { data } = this.backInfo;
    const params = {
      ...this.props,
      page,
      data,
      tab,
      currentStep,
      record: this.record,
      ...this.backInfo,
    };
    console.log('全局变量');
    console.log(params);
    return (
      <>
        <Drawer
          title='新增字段'
          placement='right'
          closable={true}
          width='46%'
          onClose={this.onClose}
          visible={visible}
          maskClosable={true}
          className='drawerConfig'
        >
          <Layout>
            <Header>
              <ISteps tab={tab} current={currentStep}></ISteps>
            </Header>
            <BackInfoContext.Provider value={params}>
              <Content>
                <IContent step={currentStep} tab={tab}></IContent>
              </Content>
              <Footer>
                {nextText !== '完成' && (
                  <Button onClick={this.preStep}>上一步</Button>
                )}
                <Button
                  type='primary'
                  onClick={this.nextStep}
                  disabled={disabledNext}
                >
                  {nextText}
                </Button>
              </Footer>
            </BackInfoContext.Provider>
          </Layout>
        </Drawer>
      </>
    );
  }
}

export default Idrawer;
