import React from 'react';
import cls from 'classnames';
import { DatePicker } from 'antd';
import moment from 'moment';
import styles from './index.less';

// eslint-disable-next-line react/prefer-stateless-function
export default class DateInput extends React.Component {
  render() {
    const { className, value, disable, ...props } = this.props;
    const valueProps = {
      value: null
    };

  if (value) {
    const mValue = moment(value);

    if (mValue.isValid()) {
      valueProps.value = mValue;
    }
  }

    return (
      <DatePicker {...props} {...valueProps} format="l" disabled={disable} className={cls([className, styles.input])} suffixIcon={<span />} />
    );
  }
}
