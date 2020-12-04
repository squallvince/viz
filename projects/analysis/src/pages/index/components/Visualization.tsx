import React, { Component } from 'react';
import 'less/Visualization.less';
import { Empty, Modal, message } from 'antd';

import { LineChartCustom, BarChartCustom, QuotaChartCustom, ItemChartCustom } from '../../components';
import PredictionModal from './PredictionModal';
import rectSvg from '../../../images/svg/rect.svg';
import solidlineSvg from '../../../images/svg/solidline.svg';
import dottedlineSvg from '../../../images/svg/dottedline.svg';
import { analysePA, IPAAnalyseParams } from '../../../service/search';

interface IDataItem {
    key: string | number;
    [prop: string]: any;
}

interface IVisualizationProps {
    chartData: IDataItem[] | any;
    searchData: any;
    onPreModalClose?: () => void;
    onPreModalSubmit?: () => void;
    onChartSwitch?: (chartType: string) => void;
}

interface IVisualizationState {
    chartIconActive: number;
    predictionVisible: boolean;
    hasPre: boolean;
    preData: Array<any>;
    hasHistory: boolean;
    historyData: Array<any>;
    hasArea: boolean;
    areaHistoryData: Array<any>;
    areaPreData: Array<any>;
    mape: number;
    hasMape: boolean;
}

interface IChartIcons {
    icon: string;
    alt: string;
    arrow: boolean;
}

export interface IModalValue {
    periods: string;
    unit: string;
    fit: string;
    confidence: string
    mape: boolean;
    selectedItemKey: string;
    time: string;
}

interface IClassification {
    date: Array<string>;
    number: Array<string>;
}

interface IAnalysePA {
    fitOriDatas: Array<any>;
    fitOriScaleDatas: Array<any>;
    preDatas: Array<any>;
    preScaleDatas: Array<any>;
    mape: number;
    classification?: IClassification;
}

class Visualization extends Component<IVisualizationProps, IVisualizationState> {

    public chartIcons: Array<IChartIcons> = [
        {
            icon: 'iconchartBar2',
            alt: '条形图',
            arrow: false
        },
        {
            icon: 'iconchartBar1',
            alt: '柱状图',
            arrow: false
        },
        {
            icon: 'iconchartLine',
            alt: '折线图',
            arrow: true
        },
        {
            icon: 'iconchartQuota',
            alt: '指标图',
            arrow: true
        },
        {
            icon: 'iconchartPoint',
            alt: '散点图',
            arrow: true
        },
        {
            icon: 'iconpredictionChart',
            alt: '预测分析',
            arrow: false
        }

    ];

    public chartTypeMap: { [key: number]: string } = {
        0: 'Item', // 条形图
        1: 'Interval', // 柱状图
        2: 'Line', // 折线图
        3: 'Indicator', // 指标图
        4: 'Blank',   // 空图
        5: 'Blank'  // 空图
    }

    get chartHeight() {
        return document.documentElement.clientHeight - 480;
    }

    constructor(props: IVisualizationProps) {
        super(props);
        this.state = {
            chartIconActive: 1,
            predictionVisible: false,
            hasPre: false,
            preData: [],
            hasHistory: false,
            historyData: [],
            hasArea: false,
            areaHistoryData: [],
            areaPreData: [],
            mape: 0,
            hasMape: false
        };
        const { onChartSwitch } = this.props;
        if (onChartSwitch){
            onChartSwitch(this.chartTypeMap[1]);
        }
    }

    getChartMap: any = (chartIconActive: number) => {
        // console.log(this.props.chartData);
        if (this.props.chartData == null) {
            return <Empty />;
        }
        switch (chartIconActive) {
            case 0:
                return <ItemChartCustom data={this.props.chartData} />;
            case 1:
                return <BarChartCustom data={this.props.chartData} />;
            case 2:
                return <LineChartCustom
                    paData={this.state}
                    data={this.props.chartData} />;
            case 3:
                return <QuotaChartCustom data={this.props.chartData} />;
            default:
                return <Empty />;

        }
    }

    chartIconsSwitch = (index: number) => {
        const { onChartSwitch } = this.props;
        if (index === 5) {
            this.openPrediction();
            return;
        }
        if (onChartSwitch){
            onChartSwitch(this.chartTypeMap[index]);
        }
        this.setState({
            chartIconActive: index
        });
    }

    openPrediction = () => {
        const { chartIconActive } = this.state;
        const { searchData } = this.props;
        if (!(Object(searchData?.sourceSql).length)) {
            message.error('请搜索');
            return;
        }
        if (chartIconActive !== 2) {
            message.error('只有折线图可以预测');
            return;
        }
        this.setState({
            predictionVisible: true
        });
    }

    closePrediction = () => {
        this.setState({
            predictionVisible: false
        });

    }

    submitPrediction = async (modalValue: IModalValue) => {
        const { searchData, onPreModalClose, onPreModalSubmit } = this.props;

        const { querySql, timeType, queryEndTime, queryStartTime } = searchData;
        const submitParam: IPAAnalyseParams = {
            ...modalValue,
            querySql,
            timeType,
            startTime: queryEndTime,
            endTime: queryStartTime
        };

        this.closePrediction();
        if (onPreModalSubmit) {
            onPreModalSubmit();
        }

        try {
            const result: IAnalysePA = await analysePA(submitParam);
            this.setState({
                hasPre: true,
                preData: result.preDatas,
                areaPreData: result.preScaleDatas,
                historyData: result.fitOriDatas,
                areaHistoryData: result.fitOriScaleDatas,
                mape: result.mape,
                hasMape: modalValue.mape
            });
            if (onPreModalClose) {
                onPreModalClose();
            }
        } catch (error) {
            if (onPreModalClose) {
                onPreModalClose();
            }
            message.error('接口返回错误');
        }

    }
    hasPreSwitch = () => {
        this.setState({
            hasPre: !this.state.hasPre
        });
    }

    hasHistorySwitch = () => {
        this.setState({
            hasHistory: !this.state.hasHistory
        });
    }

    hasAreaSwitch = () => {
        this.setState({
            hasArea: !this.state.hasArea
        });
    }

    render() {

        const { chartIconActive, mape, hasMape } = this.state;
        const { chartData } = this.props;

        return (
            <div className="visualization">
                <div className="visualization-legend">
                    {
                        this.chartIcons.map((item, index) => {
                            return <span
                                key={item.icon}
                                title={`${item.alt}`}
                                className={`item-img ${this.state.chartIconActive === index ? 'active' : ''}`}
                                onClick={() => {
                                    this.chartIconsSwitch(index);
                                }}
                            >
                                <i className={`iconfont ${item.icon}`}></i>
                                {
                                    item.arrow ? <i className="iconfont iconarrowBottom"></i> : null
                                }
                            </span>;
                        })
                    }

                </div>
                {
                    this.state.chartIconActive === 2 && <div className="pa-legend">
                        {
                            hasMape && <span>MAPE: {mape}</span>
                        }
                        <span
                            style={{ cursor: 'pointer' }}
                            onClick={this.hasAreaSwitch}
                        >
                            <img src={rectSvg} />
                            置信区间
                            </span>
                        <span
                            style={{ cursor: 'pointer' }}
                            onClick={this.hasHistorySwitch}
                        >
                            <img src={solidlineSvg} />
                            历史数据拟合
                            </span>
                        <span
                            style={{ cursor: 'pointer' }}
                            onClick={this.hasPreSwitch}
                        >
                            <img src={dottedlineSvg} />
                            预测值
                            </span>
                    </div>
                }
                <div className="visualization-chart">
                    {
                        this.getChartMap(chartIconActive)
                    }
                </div>
                <Modal
                    title="预测分析设置"
                    visible={this.state.predictionVisible}
                    footer={null}
                    maskClosable={false}
                    onCancel={this.closePrediction}
                >
                    {!!this.state.predictionVisible && <PredictionModal
                        data={{ ...chartData }}
                        onClose={this.closePrediction}
                        onSubmit={this.submitPrediction}
                    />}
                </Modal>
            </div>
        );
    }
}

export default Visualization;