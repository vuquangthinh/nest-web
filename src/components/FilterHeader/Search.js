import React from 'react';
import { Input } from 'antd';
import styles from './Search.less';

export default function Search({ defaultValue, placeholder, onSearch, onChange }) {
  return (
    <Input.Search
      className={styles.container}
      placeholder={placeholder}
      defaultValue={defaultValue}
      onChange={onChange}
      onSearch={onSearch}
    />
  );
}
