import React, { useState } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import styles from './index.less';

function getStartDate(separator, value) {
  if (value) {
    const [startDate] = value.split(',');
    return startDate;
  }

  return null;
}

function getEndDate(separator, value) {
  if (value) {
    const [, endDate] = value.split(',');
    return endDate;
  }

  return null;
}

function DateRangePickerImpl({
  placeholderStart,
  placeholderEnd,
  displayFormat,
  valueFormat,
  separator,
  value,
  onChange,
}) {
  const [endOpen, setEndOpen] = useState(false);

  const startDate = getStartDate(separator, value);
  const endDate = getEndDate(separator, value);

  const disableStartDate = startValue => {
    const endValue = getEndDate(separator, value);
    if (!startValue || !endValue) {
      return false;
    }

    return startValue.valueOf() > moment(endValue, valueFormat).valueOf();
  };

  const disableEndDate = endValue => {
    const startValue = getStartDate(separator, value);
    if (!endValue || !startValue) {
      return false;
    }

    return endValue.valueOf() <= moment(startValue, valueFormat).valueOf();
  };

  const onStartChange = sDate => {
    onChange(
      [
        moment(sDate).isValid() ? sDate.startOf('day').format(valueFormat) : '',
        getEndDate(separator, value)].join(
        separator
      )
    );
  };

  const onEndChange = eDate =>
    onChange(
      [
        getStartDate(separator, value),
        moment(eDate).isValid() ? eDate.endOf('day').format(valueFormat) : '',
      ].join(separator)
    );

  const handleStartOpenChange = open => {
    if (!open) {
      setEndOpen(true);
    }
  };
  const handleEndOpenChange = open => {
    setEndOpen(open);
  };

  const placeholder = {
    start: placeholderStart || formatMessage({ id: 'common.dateRangePicker.placeholder.start' }),
    end: placeholderEnd || formatMessage({ id: 'common.dateRangePicker.placeholder.end' }),
  };

  return (
    <div className={styles.container}>
      <DatePicker
        className={styles.input}
        disabledDate={disableStartDate}
        format={displayFormat}
        value={moment(startDate).isValid() ? moment(startDate, valueFormat) : null}
        placeholder={placeholder.start}
        onChange={onStartChange}
        onOpenChange={handleStartOpenChange}
        suffixIcon={<i className={`fas fa-caret-down ${styles.caret}`} />}
      />
      <DatePicker
        className={styles.input}
        disabledDate={disableEndDate}
        format={displayFormat}
        value={moment(endDate).isValid() ? moment(endDate, valueFormat) : null}
        placeholder={placeholder.end}
        onChange={onEndChange}
        open={endOpen}
        onOpenChange={handleEndOpenChange}
        suffixIcon={<i className={`fas fa-caret-down ${styles.caret}`} />}
      />
    </div>
  );
}

DateRangePickerImpl.defaultProps = {
  separator: ',',
  displayFormat: 'l',
  valueFormat: 'YYYY-MM-DDTHH:mm:ss.sssZ',
};


// eslint-disable-next-line react/prefer-stateless-function
export default class DateRangePicker extends React.Component {
  render() {
    return (
      <DateRangePickerImpl {...this.props} />
    );
  }
}
