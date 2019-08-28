import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { formatMessage } from 'umi/locale';
import cls from 'classnames';
import { connect } from 'dva';

function SimpleBase({
  emptyLabel,
  disable,
  value, items, type, className, ...rest }) {

  return (
    <Select
      {...rest}
      value={value}
      disabled={disable}
      className={cls([
      className,
      `constant--${type}`,
      `current-${String(value).replace(/\.\s#/, '')}`
    ])}
    >
      {emptyLabel ? <Select.Option value={null}>{emptyLabel}</Select.Option> : null}
      {items.map(({ id, title }) => (
        <Select.Option key={`${id}:${title}`} value={id}>
          {formatMessage({ id: title || 'NONE' })}
        </Select.Option>
      ))}
    </Select>
  );
}

@connect(state => ({
  constants: state.constant,
}))
export class Simple extends React.Component {
  render() {
    return (
      <SimpleBase {...this.props} />
    );
  }
}

Simple.defaultProps = {
  emptyLabel: undefined,
  value: undefined,
};

Simple.propTypes = {
  emptyLabel: PropTypes.string,
  value: PropTypes.string,
  type: PropTypes.string.isRequired,
};

export default Simple;
