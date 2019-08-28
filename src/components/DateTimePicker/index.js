import React from 'react';
import { DatePicker, TimePicker } from 'antd';
import moment from 'moment';
import styles from './index.less';

export default class DateTimePicker extends React.Component {
  static defaultProps = {
    size: 'default',
  };

  getValue() {
    const { value } = this.props;
    if (typeof value === 'string') {
      return moment(value);
    }

    return value;
  }

  handleDateChange = mDate => {
    const { onChange } = this.props;
    const value = this.getValue();
    const mValue = moment(value);

    if (mValue.isValid()) {
      const time = mValue.format('HH:mm:ss');
      const date = mDate.format('YYYY-MM-DD');
      onChange(moment(`${date} ${time}`));
    } else {
      const date = mDate.format('YYYY-MM-DD');
      onChange(moment(`${date} 00:00:00`));
    }
  };

  handleTimeChange = mTime => {
    const { onChange } = this.props;
    const value = this.getValue();
    const mValue = moment(value);

    if (mValue.isValid()) {
      const time = mTime.format('HH:mm:ss');
      const date = mValue.format('YYYY-MM-DD');
      onChange(moment(`${date} ${time}`));
    } else {
      const time = mTime.format('HH:mm:ss');
      const date = moment().format('YYYY-MM-DD');
      onChange(moment(`${date} ${time}`));
    }
  };

  render() {
    const { size } = this.props;
    const value = this.getValue();

    return (
      <div className={styles.container}>
        <DatePicker
          size={size}
          className={styles.date}
          value={value}
          showTime={false}
          format="MMM D, YYYY"
          onChange={this.handleDateChange}
        />
        <TimePicker
          size={size}
          className={styles.time}
          value={value}
          format="HH:mm"
          onChange={this.handleTimeChange}
        />
      </div>
    );
  }
}
