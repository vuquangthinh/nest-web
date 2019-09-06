import React from 'react';
import { Drawer, Modal } from 'antd';
import styles from './index.less';

export default function AeDrawer({ visible, onClose, children, header, footer }) {
  return (
    <Modal
      centered
      destroyOnClose
      className={styles.container}
      width={'auto'}
      closable={false}
      visible={visible}
      onCancel={onClose}
      footer={false}
    >
      {header}
      <div className={styles.content}>{children}</div>
      {footer}
    </Modal>

  );
}



{/* <Drawer
destroyOnClose
className={styles.container}
width={916}
closable={false}
visible={visible}
onClose={onClose}
>

</Drawer> */}