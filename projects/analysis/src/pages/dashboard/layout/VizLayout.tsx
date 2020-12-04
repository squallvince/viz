/*
 * @Author: Squall Sha
 * @Date: 2020-11-27 11:17:24
 * @Last Modified by: Squall Sha
 * @Last Modified time: 2020-12-02 16:36:42
 */

import React, { FC, useState } from 'react';
import { WidthProvider, Responsive } from 'react-grid-layout';
import { map, fromPairs } from 'ramda';
import { getFromLS } from '../../../utils';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const getVizLayout: FC = (definition) => {
  return ({ children }) => {
    const { structure } = definition;
    const childrenWithKey = fromPairs(
      map((child) => [child.key, child], children)
    );

    const originalLayouts = getFromLS('layouts') || {};
    const [layouts, setLayouts] = useState(JSON.parse(JSON.stringify(originalLayouts)));

    const onLayoutChange = (layout, layouts) => {
      // console.log(layout);
      // console.log(layouts);
      setLayouts(layouts);
    };

    return (
      <ResponsiveReactGridLayout
        className="layout"
        autoSize={true}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={30}
        layouts={layouts}
        onLayoutChange={onLayoutChange}
      >
        {map(
          (row) => {
            return (
              <div key={row.id} data-grid={row.positions}>
                {childrenWithKey[row.id]}
              </div>
            )
          },
          structure
        )}
      </ResponsiveReactGridLayout>
    );
  };
};

export default getVizLayout;
