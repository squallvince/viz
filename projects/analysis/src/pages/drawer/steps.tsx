import * as React from 'react';
import { Steps } from 'antd';
const { Step } = Steps;
export interface IStepsProps {
    current: number,
    tab: any
}

export interface IStepsState {

}

const regSteps = () => {
    return (
        <>
            <Step title="选择示例" disabled={true} />
            <Step title="选择字段" disabled={true} />
            <Step title="验证" disabled={true} />
            <Step title="保存" disabled={true} />
            <Step title="完成" disabled={true} />
        </>
    );
};
const splitSteps = () => {
    return (
        <>
            <Step title="选择示例" disabled={true} />
            <Step title="选择字段" disabled={true} />
            <Step title="保存" disabled={true} />
            <Step title="完成" disabled={true} />
        </>
    );
};

class ISteps extends React.Component<IStepsProps, IStepsState> {

    render() {
        const { current, tab } = this.props;
        return (
            <>
                <Steps current={current}>
                    {tab === 'regex' ? regSteps() : splitSteps()}
                </Steps>
            </>
        );
    }
}

export default ISteps;