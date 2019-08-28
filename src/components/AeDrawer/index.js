import React from 'react';
import { Drawer } from 'antd';
import styles from './index.less';

export default function AeDrawer({ visible, onClose, children, header, footer }) {
  return (
    <Drawer
      destroyOnClose
      className={styles.container}
      width={916}
      closable={false}
      visible={visible}
      onClose={onClose}
    >
      {header}
      <div className={styles.content}>{children}</div>
      {footer}
    </Drawer>
  );
}
