import React from 'react';
import { Select } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.less';

function FilterSelection({ roles, all, items, ...rest }) {
  return (
    <Select className={styles.container} {...rest}>
      {all && (
        <Select.Option key="" value="">
          {formatMessage({ id: 'common.selection.all' })}
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
};

export default FilterSelection;
