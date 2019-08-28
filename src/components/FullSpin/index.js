import React from 'react';
import { Spin } from 'antd';
import styles from './index.less';

export default function FullSpin() {
  return (
    <div className={styles.container}>
      <Spin />
    </div>
  );
}
