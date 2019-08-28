import React from 'react';
import styles from './Actions.less';

export default function Actions({ children }) {
  return <div className={styles.container}>{children}</div>;
}
