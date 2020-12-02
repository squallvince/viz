import React, { useEffect, useState } from 'react';

const Table = ({ primary, ...rest }) => {

  return (
    <>
      <div> {rest.title} </div>
      <div>{Math.random()}</div> <div> {JSON.stringify(primary)} </div>
    </>
  );
};

export default Table;
