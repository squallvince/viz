/*
 * @Author: Squall Sha
 * @Date: 2020-11-17 11:17:24
 * @Last Modified by: Squall Sha
 * @Last Modified time: 2020-12-01 18:02:12
 */

import React, { FC, useState } from 'react';
import { Button, Modal, Input } from 'antd';
import { CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
// import getVizLayout from './layout/VizLayout';
// import Viz from './definitionComponents/Visualization';
import definition from './dashboardDefinition.json';
import Fromlayout from './layout/FormLayout';
import Forms from './definitionComponents/Forms';
import DataSources from './definitionComponents/DataSources';
import Token from './definitionComponents/Token';
import config from './config.json';
import './dashboard.less';
const { TextArea } = Input;
const prefix: string = 'dashboard';
const isEdit = (mode: String) => {
  let edit = false;
  if (mode === 'create' || mode === 'edit') {
    edit = true;
  }
  return edit;
};

const Dashboard: FC = (props) => {
  const { location } = props;
  const mode = (window as any).Common360.Utils.Tools.GetLastPathName(location.pathname);
  const { forms, visualizations: viz, dataSources, layout, custom, tokens } = definition;
  const [title, setTitle] = useState(custom.title);
  const [description, setDescription] = useState(custom.description);
  const [outToEdit, setOutToEdit] = useState(false);

  const CloseEdit = () => {
    setOutToEdit(isEdit(mode));
  };
  const CloseModal = () => {
    setOutToEdit(false);
  };
  const GoToDetail = () => {
    window.singleSpaNavigate('/analysis/dashboard/detail');
  };
  const titleOnChange = (e: Event) => {
    setTitle(e.target.value);
  };
  const descriptionOnChange = (e: Event) => {
    setDescription(e.target.value);
  };
  // const dependency = importVizAndForm(definition);
  // const tokenAtoms = createAtomFromToken(tokens);
  // const vizSelectors = getVizSelectorsFromDefinition(tokenAtoms)(viz);
  // const dataSourceSelectors = getDataSourceSelectorFromDefinition(tokenAtoms)(dataSources);
  // const vizComponents = mapObjIndexed(
  //   (v, k) => vizFactory(k, dataSourceSelectors, vizSelectors, dependency),
  //   viz
  // );

  return (
    <section className={`${prefix}-container`}>
      <div className={`${prefix}-title`}>
        <h1>{config[mode].title}</h1>
        {(mode === 'create' || mode === 'edit') && (
          <Button icon={<CloseOutlined style={{ color: '#ffffff' }} />} onClick={CloseEdit} />
        )}
        <Modal
          title={'退出编辑'}
          visible={outToEdit}
          centered={true}
          width={400}
          onCancel={CloseModal}
          cancelText={config.cancelText}
          okText={config.confrimText}
          onOk={GoToDetail}
        >
          <div className={`${prefix}-modal-content`}>
            <ExclamationCircleOutlined /> 你还没有保存，确定要退出编辑么？
          </div>
        </Modal>
      </div>
      <div className={`${prefix}-canvas`}>
        {(mode === 'create' || mode === 'edit') && (
          <>
            <Forms defaultForm={forms} Layout={Fromlayout} />
            <div className="input-area">
              <Input placeholder={config.titlePlaceholder} value={title} onChange={titleOnChange} />
              <TextArea className="description" placeholder={config.descriptionPlaceholder} value={description} onChange={descriptionOnChange} />
            </div>
          </>
        )}
        {mode === 'detail' && (
          <>
            <h1>{title}</h1>
            <p>{description}</p>
          </>
        )}
      </div>
      <DataSources defaultDataSource={dataSources} />
      <Token defaultToken={tokens} />
      {/* <Viz defaultViz={viz} Layout={ getVizLayout(layout) } /> */}
    </section>
  );
};
export default Dashboard;
