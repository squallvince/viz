/*
 * @Author: Squall Sha
 * @Date: 2020-11-17 11:17:24
 * @Last Modified by: Squall Sha
 * @Last Modified time: 2020-11-18 16:31:30
 */
import React from 'react';
import { Button, Select, Input, Card, Row, Col, Space, Modal, Form, message, Popover  } from 'antd';
import { SearchOutlined, PlusOutlined, CheckOutlined, EllipsisOutlined } from '@ant-design/icons';
import 'less/dashboard-list.less';
import IShareModal from './modals/share';
import IDetails from './modals/details';
import ICopyBoard from './modals/copy';
import Ipagination from '../components/Pagination';
import { getDashboardList, addBoard, deleteBoard } from '../../service/dashboard';
import img from '../../images/newboard.png';
const { TextArea } = Input;

export interface DashboardState {
  sortValue: number,
  showShare: boolean,
  showContent: boolean,
  showCopy: boolean,
  showDel: boolean,
  activeItem: any,
  showAdd: boolean,
  overId: any,
  total: number,
  dashboardList: any[],
  defaultCurrent: number,
  defaultPageSize: number,
  current: number
}

const { Option } = Select;
const optionArr = [
  { value: '', label: '按修改时间排序' },
  { value: 'creatTime-asc', label: '按创建时间A-Z' },
  { value: 'creatTime-desc', label: '按创建时间Z-A' },
  { value: 'name-asc', label: '按名称A-Z' },
  { value: 'name-desc', label: '按名称Z-A' },
  { value: 'creater-asc', label: '按创建者A-Z' },
  { value: 'creater-desc', label: '按创建者Z-A' }
];
const menuList = ['分享', '属性', '复制', '删除'];

// ===================
const optionsEl = (sortValue): any => {
  return optionArr.map(({ value, label }) => {
    if (sortValue === value) {
      return (<>
        <Option key={value} value={value}>{label}</Option>

      </>);
    } else {
      return <><Option key={value} value={value}>{label}</Option>
      </>;
    }

  });
};

const detailBoard = function (item) {
  const {name, creatTime, updateTime, shareStartTime, shareEndTime, creator} = item;
  return (
    (
      <ul className="detailBoard">
        <li>仪表盘名称：{name}</li>
        {shareStartTime && (<li>分享有效期：剩余<span className="availble">{countDate(shareStartTime, shareEndTime)}</span>天,
        有效期截止<span className="availble">{shareEndTime}</span></li>
        )}
        <li>所有者：{creator}</li>
        <li>创建时间：{creatTime}</li>
        <li>修改时间：{updateTime}</li>
      </ul>
    )
  )
}

function countDate(startTime, endTime) {
  const dateStart = new Date(startTime);
  const dateEnd = new Date(endTime);
  return (dateEnd - dateStart) / (1000 * 60 * 60 * 24);
}

class DashboardList extends React.Component<DashboardState> {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      sortValue: '',
      activeItem: {},
      showAdd: false,
      overId: null,
      total: 0,
      dashboardList: [],
      defaultCurrent: 1,
      defaultPageSize: 20,
      current: 1,
      currModal: 0 // 1:share 2content 3copy 4del

    };
  }
  confirm = (id,self) => {
    Modal.warning({
      title: '删除仪表盘',
      content: '删除仪表盘后数据不可恢复，是否确认删除？',
      okText: '确认',
      icon: '',
      onOk() {
        console.log(self)
        return deleteBoard({ id }).then(res => {
          message.success('删除成功');
          self.setState({
            currModal: 0
          })
          self.getList();
          return Promise.resolve()
        })
      }
    });
  }

  handleChange = (value) => {
    if (value) {
      const condition = value.split('-')[0];
      const sortord = value.split('-')[1];
      this.param = Object.assign(this.param, { condition, sortord });
    } else {
      this.param = Object.assign(this.param, { condition:'', sortord:'' });
    }
    this.getList();

  }
  showMenu = (item) => {
    const { activeItem } = this.state;
    if (activeItem && activeItem.id) {
      this.setState({
        activeItem: {},
        currModal: 0
      });
    } else {
      this.setState({
        activeItem: item
      });
    }

  }
  showOver = (id) => {
    console.log(id)
    this.setState({overId: id})
  }
  showModal = (e) => {
    const el = e.currentTarget;
    this.setState({
      currModal: Number(el.getAttribute('data-rel')) + 1
    });
  }
  // 新增仪表盘
  addDashboard = () => {
    const param = this.formRef.current.getFieldsValue();
    if (!param.name) {
      message.error('请输入仪表盘名称');
      return;
    }
    addBoard(param).then(res => {
      const pathname = '/analysis/dashboard/edit';
      this.setState({
        showAdd: false
      });
      this.getList();
      window.open(`${location.origin}${pathname}?id=${res}`);
    });
  }
  hideModal = () => {
    this.formRef.current.resetFields();
    this.setState({
      showAdd: false
    });
  }
  getList = () => {
    getDashboardList(this.param).then(res => {
      const { count, dashboardList } = res;
      this.setState({
        total: count,
        dashboardList,
        currModal: 0,
        activeItem: {}
      });
    });
  }
  search = (e) => {
    e.persist();
    if (e.key === 'Enter') {
      this.param = Object.assign(this.param, { keyWord: e.target.defaultValue });
      this.getList();
    }
  }
  changePage = (page, pageSize) => {
    this.setState({ current: page });
    this.param = Object.assign(this.param, { page, pageSize });
    this.getList();
  }
  componentDidMount() {
    this.param = { page: 1, pageSize: 20 };
    this.getList();

  }
  render() {
    const { sortValue, activeItem, currModal, showAdd, total, dashboardList, defaultCurrent, defaultPageSize, current } = this.state;
    return (
      <div className="dashboardList">
        <header className="title">
          <span>仪表盘管理</span>
          <div className="operations">
            <Input type="primary" prefix={<SearchOutlined />} placeholder="搜索关键词" onKeyPress={ (e)=>this.search(e) }/>

          <Select defaultValue="" style={{ width: 160 }} onChange={this.handleChange}>
            {optionsEl(sortValue)}
            </Select>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => {this.setState({showAdd: true}); }}>
              新建仪表盘
          </Button>
          </div>
          </header>
          <section>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 24 }}>
            {dashboardList.map((item, idx) => {
          const {name, imageUrl, panelNum} = item;
          return (
            <Col key={item.id} className="gutter-row card" xs={12} sm={12} xl={6}>
              <Card
                style={{ marginTop: 25 }}
                type="inner"
                extra={
                  <Space>
                    <EllipsisOutlined onClick={() => this.showMenu(item) } className={(activeItem && activeItem.id === item.id) ? 'active' : ''}/>
                  </Space>
              }
            >
              <Row >
                  <Col span={10}>
                    <img src={imageUrl || img}/>
                    </Col>
                    <Popover content={detailBoard(item)} className="details" title="" placement="bottom"  arrowPointAtCenter>
                  <Col span={14}>
                    <p className="title">{ name }</p>
                    <p className="desc">{ panelNum || 0 }图表组成</p>
                    </Col>
                    </Popover>
                </Row>
                </Card>
              {
                activeItem && activeItem.id === item.id &&
                (<ul className="opermenu" >
                  {
                    menuList.map((v, i) => {
                      return (
                        <li key={i } data-rel={i} onClick={(e) => this.showModal(e)} className={currModal === i + 1 ? 'active' : ''}>
                          <CheckOutlined />
                          <span>{v}</span>
                        </li>
                      );
                    })
                  }
              </ul>)
              }
          </Col>
          );
        })}
          </Row>
          </section>
          <Ipagination total={total} defaultCurrent={defaultCurrent} current={current} defaultPageSize={defaultPageSize} changePage={this.changePage}></Ipagination>
        {
          currModal === 1 ? <IShareModal item={activeItem} currModal={currModal} onClose={ () => {this.setState({currModal: 0}); }}/> :
            currModal === 2 ? <IDetails item={activeItem} currModal={currModal} onClose={() => { this.setState({ currModal: 0 }); this.getList(); }}/> :
              currModal === 3 ? <ICopyBoard item={activeItem} currModal={currModal} onClose={() => { this.setState({ currModal: 0 }); this.getList(); }}/> :
          currModal === 4 ? this.confirm(activeItem.id, this) : ''
          }

        <Modal
          title="新建仪表盘"
          visible={showAdd}
          onCancel={this.hideModal}
          className="detailModal"
          footer={[
            <Button key="submit" type="primary" onClick={this.addDashboard}>
              保存
            </Button>
          ]}
        >
         <Form  ref={this.formRef} name="control-ref" >
            <Form.Item name="name" label="仪表盘名称" rules={[{ required: true }]}>
                <Input autoComplete="off"/>
              </Form.Item>
              <Form.Item name="describe" label="仪表盘描述">
                <TextArea autoComplete="off"/>
              </Form.Item>
        </Form>
        </Modal>
      </div>
    );
  }
}

export default DashboardList;
