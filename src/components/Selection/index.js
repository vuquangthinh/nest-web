import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { formatMessage } from 'umi/locale';
import cls from 'classnames';
import { connect } from 'dva';
import { EMPTY_ARRAY } from '@/constants';

function Selection({
  emptyLabel,
  emptyValue,
  placeholder,
  value,
  disable,
  items,
  type,
  className,
  ...rest
}) {

  return (
    <Select
      {...rest}
      placeholder={placeholder}
      value={value}
      disabled={disable}
      className={cls([
      className,
      `constant--${type}`,
      `current-${String(value).replace(/\.\s#/, '')}`
    ])}
    >
      {emptyLabel ? <Select.Option value={emptyValue}>{emptyLabel}</Select.Option> : null}
      {items.map(({ id, title }) => (
        <Select.Option key={`${id}:${title}`} value={id}>
          {formatMessage({ id: title || 'NONE' })}
        </Select.Option>
      ))}
    </Select>
  );
}

Selection.defaultProps = {
  emptyLabel: undefined,
  emptyValue: null,
  // value: null,
  placeholder: undefined,
};

Selection.propTypes = {
  emptyLabel: PropTypes.string,
  emptyValue: PropTypes.any,
  // value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string,
  type: PropTypes.string.isRequired,
};

export default connect((state, { type }) => ({
  items: state.constant[type] ? state.constant[type] : EMPTY_ARRAY
}))(Selection);
