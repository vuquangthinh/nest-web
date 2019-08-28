
import React from 'react';
import { Select } from 'antd';
import toString from 'lodash/toString';

// eslint-disable-next-line react/prefer-stateless-function
export default class TagSelection extends React.Component {
  static defaultProps = {
    allowItem: () => true
  };

  render() {
    const { value, onChange, allowItem, ...rest } = this.props;
    const items = toString(value).trim().split(/\s*,\s*/).filter(x => !!x);

    return (
      <Select {...rest} value={items} tokenSeparators={[',']} mode="tags" onChange={v => onChange(v.filter(allowItem).join(','))}>
        {items.map(title => (
          <Select.Option key={title} value={title}>
            {title}
          </Select.Option>
            ))}
      </Select>
    );
  }
}
