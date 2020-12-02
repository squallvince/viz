import * as React from 'react';
import ITabs from './tabs';
import StepReg from './stepReg';
import StepSplit from './stepSplit';
import { BackInfoContext } from "../context";

export interface ISteps1Props {
}

export interface ISteps1State {
  result: any[];
}

class IStepsReg extends React.Component<ISteps1Props, ISteps1State> {
  static contextType = BackInfoContext;
  render() {
    const { tab, extract } = this.context;
    return (
      <div className="step1">
        <ITabs showFlag={false}></ITabs>
        {tab === 'regex' ? (
          extract && <StepReg></StepReg>
        ) : (
          <StepSplit></StepSplit>
        )}
      </div>
    );
  }
}

export default IStepsReg;