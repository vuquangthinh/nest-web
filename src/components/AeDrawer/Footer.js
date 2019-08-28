import React from 'react';
import styles from './Footer.less';

export default function Footer({ actions }) {
  return (
    <div className={styles.container}>
      <div className={styles.actions}>{actions}</div>
    </div>
  );
}
