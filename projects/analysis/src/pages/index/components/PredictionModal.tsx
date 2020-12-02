import { DownOutlined, CaretDownOutlined } from '@ant-design/icons';
import { Form, Input, Select, Slider, Switch, Button } from 'antd';
import { StoreValue } from 'antd/es/form/interface';
import { RuleObject } from 'antd/lib/form';
import { trim } from 'lodash';
import React from 'react';


import '../../../less/predictionmodal.less';

interface IMenuItem {
  text: string;
  unfold: boolean;
  children: Array<{ [key: string]: string | any }>;
}

interface IPredictionModalProps {
  data: any;
  onClose?: () => void;
  onSubmit?: () => void;
}

interface IPredictionModalState {
  menus: Array<IMenuItem>;
  selectedItemIndex: number;
  selectedItemKey: string;
  formValue: any;
  formInValid: boolean;
  advancedShow: boolean;
}

const { Option } = Select;

const itemStyle = {
  transform: 'rotate(-90deg)'
};

const advancedIconStyle = {
  transform: 'rotate(90deg)'
};

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

const layoutFooter = {
  wrapperCol: { span: 24 }
};

const footerStyle = {
  display: 'flex',
  justifyContent: 'flex-end'
};

const btnStyle = {
  marginRight: '20px'
}

export default class PredictionModal extends React.Component<IPredictionModalProps, IPredictionModalState>{

  private formRef = React.createRef<any>();

  private timer: any = null;

  get units() {
    return [
      {
        key: '1second',
        value: '1秒'
      },
      {
        key: '10second',
        value: '10秒'
      },
      {
        key: '20second',
        value: '20秒'
      },
      {
        key: '1minute',
        value: '1分钟'
      },
      {
        key: '10minute',
        value: '10分钟'
      },
      {
        key: '30minute',
        value: '30分钟'
      },
      {
        key: '1hour',
        value: '1小时'
      },
      {
        key: '6hour',
        value: '6小时'
      },
      {
        key: '12hour',
        value: '12小时'
      },
      {
        key: '1day',
        value: '1天'
      },
      {
        key: '1month',
        value: '1月'
      },
      {
        key: '1year',
        value: '1年'
      }
    ];
  }

  get formDefalutValue() {
    return {
      a: '1',
      b: '1',
      c: '0.05',
      d: '0.95',
      e: false
    };
  }

  constructor(props: IPredictionModalProps) {
    super(props);
    const { data } = this.props;
    let columns = data?.classification?.number || [];
    columns = columns.map((item: any, i: number) => {
      return {
        key: item,
        value: item,
        isActive: i === 0 ? true : false
      };
    });
    this.state = {
      menus: [
        {
          text: '预测数据',
          unfold: true,
          children: [...columns]
        },
        {
          text: '时序预测',
          unfold: true,
          children: [
            {
              key: 'prophet',
              value: 'Prophet',
              isActive: true
            }
          ]
        }
      ],
      selectedItemIndex: 0,
      selectedItemKey: '111',
      formValue: {},
      formInValid: true,
      advancedShow: false,
    };
  }

  componentDidMount() {
    // this.setFormDefaultVal();
    this.formValidate();
  }

  unfoldSwitch = (i: number) => {
    this.state.menus[i].unfold = !this.state.menus[i].unfold;
    this.forceUpdate();
  }

  advanceShowSwitch = () => {
    this.setState({
      advancedShow: !this.state.advancedShow
    });
  }

  selectedItemIndexSwitch = (i: number, item: any) => {
    this.state.menus[0].children.map(item => item.isActive = false);
    this.state.menus[0].children[i].isActive = true;
    this.setState({
      selectedItemKey: item.key
    });
    this.forceUpdate();
  }

  setFormDefaultVal = () => {
    this.formRef.current.setFieldsValue({
      a: '1',
      b: '1',
      c: '0.05',
      d: '0.95',
      e: false
    });
  }

  formValueChange = () => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.formValidate();
    }, 200);

  }

  formValidate = () => {
    const validateFields = this.formRef.current.validateFields();
    validateFields.then(
      () => {
        this.setState({
          formInValid: false
        });
      },
      () => {
        this.setState({
          formInValid: true
        });
      }
    );
  }

  formSubmit = () => {
    const formValue = this.formRef.current.getFieldsValue();
    console.log({ ...formValue, selectedItemKey: this.state.selectedItemKey });

    const then = Promise.resolve();
    then.then(() => {
      if (this.props.onSubmit) {
        this.props.onSubmit();
      }
    });

  }

  validateCustom = (rule: RuleObject, value: StoreValue) => {
    if (trim(value)?.length > 0) {
      if (Number.isNaN(Number(trim(value)))) {
        return Promise.reject('必须是数字');
      }
      return Promise.resolve();
    } else {
      return Promise.reject('不能为空');
    }
  }

  render() {
    return (
      <div className="prediction">
        <div className="prediction-left">
          {
            this.state.menus.map((item, i) => {
              return <React.Fragment key={i}>
                <div className="item" onClick={() => this.unfoldSwitch(i)}>
                  <p title={item.text}>{item.text}</p>
                  <DownOutlined style={item.unfold ? {} : itemStyle} />
                </div>
                {
                  !!item.unfold && <div className="item-sub">
                    {
                      item.children.map((child, ci) => {
                        return <p
                          title={child.value}
                          onClick={() => { this.selectedItemIndexSwitch(ci, child) }}
                          className={child.isActive ? 'active' : ''}
                          key={ci}>{child.value}</p>;
                      })
                    }
                  </div>
                }

              </React.Fragment>;
            })
          }
        </div>
        <div className="prediction-right">
          <Form
            {...layout}
            ref={this.formRef}
            name="form"
            initialValues={this.formDefalutValue}
            onValuesChange={this.formValueChange}
          >
            <header>基础参数</header>
            <Form.Item
              label="预测长度"
              name="a"
              rules={[
                { validator: this.validateCustom }
              ]}
            >
              <Input
                style={{ width: '130px' }}
              />
            </Form.Item>
            <Form.Item
              label="时间间隔"
              name="b"
              extra="以原始数据时间间隔为最小计算倍数"
            >
              <Select style={{ width: 120 }} >
                {
                  this.units.map(item => {
                    return <Option
                      key={item.key}
                      value={item.key}
                    >{item.value}</Option>;
                  })
                }
              </Select>


            </Form.Item>
            <header
              onClick={this.advanceShowSwitch}>
              高级参数
              <CaretDownOutlined style={this.state.advancedShow ? {} : advancedIconStyle} />
            </header>
            {
              this.state.advancedShow && <React.Fragment><Form.Item
                label="模型拟合度"
                name="c"
                extra="建议0.05左右"
                rules={[
                  { validator: this.validateCustom }
                ]}
              >
                <Input
                  style={{ width: '130px' }}
                />
              </Form.Item>

                <Form.Item
                  label="置信度"
                  name="d"
                >
                  <Slider
                    max={1}
                    min={0}
                    step={0.01}
                  />
                </Form.Item>

                <Form.Item
                  valuePropName="checked"
                  label="MAPE"
                  name="e"
                  extra="预测效果指标评估越小越好"
                >
                  <Switch />
                </Form.Item>
              </React.Fragment>
            }
            <Form.Item
              {...layoutFooter}
            >
              <footer style={footerStyle}>
                <Button
                  type="primary"
                  style={btnStyle}
                  disabled={this.state.formInValid}
                  onClick={this.formSubmit}>
                  确定
                </Button>
              </footer>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}
