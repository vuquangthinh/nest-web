import React from 'react';
import { Select } from "antd";

// eslint-disable-next-line arrow-body-style
const DefaultSelection = ({ items, value, ...rest }) => {
  return (
    <Select {...rest} autoClearSearchValue defaultValue={value}>
      {items.map(({ id, title }) => (
        <Select.Option key={`${id}:${title}`} value={id}>
          {title}
        </Select.Option>
          ))}
    </Select>
    );
};

export default DefaultSelection;
