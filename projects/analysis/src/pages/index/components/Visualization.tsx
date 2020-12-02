import React, { Component } from 'react';
import 'less/Visualization.less';
import { Empty, Modal, message } from 'antd';

import { LineChartCustom, BarChartCustom, QuotaChartCustom, ItemChartCustom } from '../../components';
import PredictionModal from './PredictionModal';
import rectSvg from '../../../images/svg/rect.svg';
import solidlineSvg from '../../../images/svg/solidline.svg';
import dottedlineSvg from '../../../images/svg/dottedline.svg';

interface IDataItem {
    key: string | number;
    [prop: string]: any;
}

interface IVisualizationProps {
    chartData: IDataItem[];
    onPreModalClose?: () => void;
    onPreModalSubmit?: () => void;
}

interface IVisualizationState {
    chartIconActive: number;
    predictionVisible: boolean;
    hasPre: boolean;
    hasHistory: boolean;
    hasArea: boolean;
    // chartComponent: any;
}

interface IChartIcons {
    icon: string;
    alt: string;
    arrow: boolean;
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


    get chartHeight() {
        return document.documentElement.clientHeight - 480;
    }

    constructor(props: IVisualizationProps) {
        super(props);
        this.state = {
            chartIconActive: 1,
            predictionVisible: false,
            hasPre: true,
            hasHistory: false,
            hasArea: false
            // chartComponent: this.getChartMap(1)
        };

        // console.log(this.props.chartData);

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
                    hasPre={this.state.hasPre}
                    hasHistory={this.state.hasHistory}
                    hasArea={this.state.hasArea}
                    data={this.props.chartData} />;
            case 3:
                return <QuotaChartCustom data={this.props.chartData} />;
            default:
                return <Empty />;

        }
    }

    chartIconsSwitch = (index: number) => {
        // console.log(this.props.chartData);

        if (index === 5) {
            this.openPrediction();
            return;
        }
        this.setState({
            chartIconActive: index
        });
    }

    openPrediction = () => {
        const { chartIconActive } = this.state;
        if (chartIconActive !== 2) {
            message.warn('只有折线图可以预测');
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

    submitPrediction = () => {
        const { onPreModalClose, onPreModalSubmit } = this.props;

        this.closePrediction();
        if (onPreModalSubmit) {
            onPreModalSubmit();
        }

        setTimeout(() => {
            if (onPreModalClose) {
                onPreModalClose();
            }
        }, 3000);

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

        const { chartIconActive } = this.state;
        // console.log(this.chartIcons);

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
                        <span>MAPE: 12</span>
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
                        data={this.props.chartData}
                        onClose={this.closePrediction}
                        onSubmit={this.submitPrediction}
                    />}
                </Modal>
            </div>
        );
    }
}

export default Visualization;