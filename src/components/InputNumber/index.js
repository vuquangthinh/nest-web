import React from 'react';
import { InputNumber} from 'antd';
// import styles from './index.less';

// eslint-disable-next-line react/prefer-stateless-function
export default class InputNumberCustom extends React.Component {
  render() {
    return (
      <InputNumber {...this.props} />
    );
  }
}
