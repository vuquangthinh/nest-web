import React from 'react';

import styles from './styles.less';


export default function PageContent({ children }) {
  return (
    <div className={styles.container}>{children}</div>
  );
}
