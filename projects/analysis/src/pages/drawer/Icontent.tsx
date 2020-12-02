import * as React from 'react';
import ISteps0 from './mainContent/step0';
import ISteps1 from './mainContent/step1';
import ValiReg from './mainContent/step2';
import ISaveColumn from './mainContent/save';
import Finish from './mainContent/finish';

export interface IContentProps {
  step: number;
  tab: string;
}
 
export interface IContentState {
    
}
 
class IContent extends React.Component<IContentProps, IContentState> {
    // state = { :  }
    renderComponents = () => {
      const { step, tab } = this.props;
        switch (step) {
          case 0:
            return <ISteps0></ISteps0>;
            break;

          case 1:
            return <ISteps1></ISteps1>;
            break;
          case 2:
            return (tab === 'regex' ? <ValiReg></ValiReg> : <ISaveColumn></ISaveColumn>);
            break;
          case 3:
            return (tab === 'regex' ? <ISaveColumn></ISaveColumn> : (<Finish></Finish>));
            break;
          case 4:
            return (<Finish></Finish>);
            break;
          default:
            return '默认';
        }
    }
    render() { 
        return <>{this.renderComponents()}</>;
    }
}
 
export default IContent;