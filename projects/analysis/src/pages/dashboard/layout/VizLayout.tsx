/*
 * @Author: Squall Sha
 * @Date: 2020-11-27 11:17:24
 * @Last Modified by: Squall Sha
 * @Last Modified time: 2020-12-01 11:06:27
 */

import React, { FC } from 'react';
// import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import { map, fromPairs } from 'ramda';

const getVizLayout: FC = (definition) => {
  return ({ children }) => {
    const { structure } = definition;
    const childrenWithKey = fromPairs(
      map((child) => [child.key, child], children)
    );

    return (
      <>
        {map(
          (row) => (
            <div key={row.i}>
              {childrenWithKey[row]}
            </div>
          ),
          structure
        )}
      </>
    );
  };
};

export default getVizLayout;
