import { Input } from 'antd';
import React from 'react';

const InputText = ({ states }) => {
  const { primary } = states;
  const [primaryToken, setPrimaryToken] = primary;
  return (
    <>
      <Input
        onChange={(e) => setPrimaryToken(e.target.value)}
        value={primaryToken}
      />
    </>
  );
};

export default InputText;
