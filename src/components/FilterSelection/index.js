import React from 'react';
import { Select } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.less';

function FilterSelection({ all, allText, items, value, ...rest }) {

  let newValue = value;

  if (value !== "") {
    // eslint-disable-next-line no-restricted-globals
    newValue = isNaN(value) ? value : Number(value)
  }

  return (
    <Select className={styles.container} {...rest} value={newValue}>
      {all && (
        <Select.Option key="" value="">
          {allText || formatMessage({ id: 'common.selection.all' })}
        </Select.Option>
      )}

      {items.map(({ id, title }) => (
        <Select.Option key={`${id}:${title}`} value={id}>
          {title}
        </Select.Option>
      ))}
    </Select>
  );
}

FilterSelection.defaultProps = {
  all: true,
  items: [],
  allText: '',
};

export default FilterSelection;
