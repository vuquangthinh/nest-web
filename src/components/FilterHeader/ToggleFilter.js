import React from 'react';
import { Button } from 'antd';
import styles from './ToggleFilter.less';

export default function ToggleFilter({ children, onClick }) {
  return (
    <Button className={styles.button} onClick={onClick}>
      {children}
    </Button>
  );
}
