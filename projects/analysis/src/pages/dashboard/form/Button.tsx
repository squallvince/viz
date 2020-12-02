import { Button } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

import React from 'react';

const InputText = ({ con }) => {
  // const { primary } = states;
  // const [primaryToken, setPrimaryToken] = primary;
  return (
    <>
      <Button size="large">
        <SaveOutlined />{con.title}
      </Button>
    </>
  );
};

export default InputText;
