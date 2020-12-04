/*
 * @Author: Squall Sha
 * @Date: 2020-12-02 11:17:24
 * @Last Modified by: Squall Sha
 * @Last Modified time: 2020-12-03 11:36:44
 */

import React, { useEffect, useState } from 'react';
import { Chart, Legend, View, Axis, Geom } from 'bizcharts';
import { Empty } from 'antd';
import { chartToVisua } from '../../index/trans';

const TYPES = ['date', 'timestamp'];

let scaleMax = Number.MIN_SAFE_INTEGER;

const chartHeight = (): number => {
  const clientHeight = document.documentElement.clientHeight - 380;
  return clientHeight < 500 ? 500 : clientHeight;
}

const getStep = (max: number): number => {
  let step = 1;
  while ((max / 10) > 1) {
    max = max / 10;
    step = step * 10;
  }
  return step / 2;
};

const filterPredData = (chartData: any[]) => {
  if (chartData) {
    return chartData.filter(item => item?.isPre);
  }
  return [];
};

const isMatch = (param: any) => {
  const classificationKeys = Object.keys(param);
  const mixins = classificationKeys.filter((item) => {
    return TYPES.includes(item);
  });

  if (mixins.length === 0) {
    // message.warning("没有date类型字段");
    return false;
  }

  if (Reflect.has(param, 'string')) {

    // message.warning("有多余类型字段（如string）");
    return false;
  }

  if (!Reflect.has(param, 'number')) {
    // message.warning("没有number类型字段");
    return false;
  }

  return true;
};

const LineChartComponent = ({ primary, opt }) => {
  const [chartDatas, setChartDatas] = useState([]);
  useEffect(() => {
    if (!Array.isArray(primary)) {
      const { selectDataSchema, datas } = primary;
      setChartDatas(chartToVisua({selectDataSchema, datas}));
    }
  }, [primary]);

  const tranform = (): any => {
    if (Array.isArray(chartDatas)) return false;

    let ans: { y: number; x: any; group: string }[] = [];
    if (!isMatch(chartDatas.classification)) {
      return false;
    }
    if (chartDatas.classification.number == null) return false;
    if (chartDatas.classification.date == null) return false;
    chartDatas.datas.forEach((item, i) => {
      chartDatas.classification.number.forEach((sub) => {
        if (Number(item[sub] > scaleMax)) {
          scaleMax = Number(item[sub]);
        }
        const obj = {
          y: Number(item[sub]),
          x: item[chartDatas.classification.date[0]],
          group: `${sub}`,
        };
        ans.push(obj);
      });
    });
    return ans;
  };

  const { hasPre, hasHistory, hasArea } = opt;
  let chartTransData = tranform();

  const scale = {
    x: {
      mask: 'YYYY-MM-DD HH:mm:ss',
      range: [0.05, 0.95],
      sync: true,
      nice: true
    },
    y: {
      // 由于使用不同View，需要设定 scale 的 min 和 max
      min: 0,
      max: scaleMax + getStep(scaleMax)
    }
  };

  /**
   * 假数据，最后要删除 start
   */
  const preData = [
    {
      group: '_col1',
      x: '2020-10-10',
      y: 200,
      isPre: true
    },
    {
      group: '_col1',
      x: '2020-10-11',
      y: 100,
      isPre: true
    },
    {
      group: '_col1',
      x: '2020-10-12',
      y: 300,
      isPre: true
    }
  ];

  if (hasPre && chartTransData) {
    chartTransData = chartTransData.concat(preData);
  }

  const areaPreData = [
    {
      group: '_col1',
      x: '2020-10-10',
      y: [100, 300],
    },
    {
      group: '_col1',
      x: '2020-10-11',
      y: [120, 400],
    },
    {
      group: '_col1',
      x: '2020-10-12',
      y: [150, 500],
    }
  ];
  const historyData = [
    {
      group: '_col1',
      x: '2020-10-10',
      y: 400,
      isPre: true
    },
    {
      group: '_col1',
      x: '2020-10-11',
      y: 600,
      isPre: true
    },
    {
      group: '_col1',
      x: '2020-10-12',
      y: 800,
      isPre: true
    }
  ];
  const areaHistoryData = [
    {
      group: '_col1',
      x: '2020-10-10',
      y: [300, 500],
    },
    {
      group: '_col1',
      x: '2020-10-11',
      y: [500, 700],
    },
    {
      group: '_col1',
      x: '2020-10-12',
      y: [700, 900],
    }
  ];
  /**
   * 假数据，最后要删除 end
   */
  const preChartData = filterPredData(chartTransData);

  return (
    <>
      {chartTransData === false && (
        <Empty />
      )}
      {chartTransData && (
        <Chart
          padding={[20, 20, 50, 40]}
          autoFit
          height={chartHeight()}
        >
          <View
            data={chartTransData}
            scale={scale}
          >
            <Axis name="x" />
            <Geom
              type="line"
              position="x*y"
              color="group"
              tooltip={true}
            />
            <Geom
              type="point"
              position="x*y"
              size={4}
              shape={'circle'}
              tooltip={false}
              color="group"
            />
          </View>
          <Legend
            namg="y"
            position="top-right"
            offsetY={20}
            itemName={{
              spacing: 10, // 文本同滑轨的距离
              style: {
                fill: '#EAEAEA',
                fontSize: 20
              }
            }}
          />
          {/* 预测数据开始 */}
        {
          hasArea && <View
            data={areaPreData}
            scale={scale}
          >
            <Axis name="y" visible={false} />
            <Axis name="x" visible={false} />
            <Geom
              type="area"
              position="x*y"
              color={['group', ['#AFAFAF']]}
              // shape="dash"
              tooltip={false}
            />
          </View>
        }
        {
          hasPre && <View
            data={preChartData}
            scale={scale}
          >
            <Axis name="y" visible={false} />
            <Axis name="x" visible={false} />
            <Geom
              type="line"
              position="x*y"
              color={['group', ['#fff']]}
              shape="dash"
              tooltip={false}
            />
          </View>
        }
        {/* 预测数据结束 */}
        {/* 历史拟合数据开始 */}
        {
          hasArea && <View
            data={areaHistoryData}
            scale={scale}
          >
            <Axis name="y" visible={false} />
            <Axis name="x" visible={false} />
            <Geom
              type="area"
              position="x*y"
              color={['group', ['#AFAFAF']]}
              // shape="dash"
              tooltip={false}
            />
          </View>
        }
        {
          hasHistory && <View
            data={historyData}
            scale={scale}
          >
            <Axis name="y" visible={false} />
            <Axis name="x" visible={false} />
            <Geom
              type="line"
              position="x*y"
              color={'group'}
              tooltip={false}
            />
          </View>
        }
        {/* 历史拟合数据结束 */}
        </Chart>
      )}
    </>
  );
};

export default LineChartComponent;
