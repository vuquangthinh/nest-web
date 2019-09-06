import React, { useCallback, Fragment, useState } from "react";
import { Modal, Icon } from "antd";
import styles from './index.less';

export default function RoleTitle({ children }) {
  const [visible, setVisible] = useState(false);

  const handleClick = useCallback(
    () => {
      setVisible(true);
    },
    [visible]
  );

  const handleClose = useCallback(
    () => {
      setVisible(false);
    },
    [visible]
  );

  return (
    <Fragment>
      <div className={styles.title} onClick={handleClick}>{children} <Icon type="edit" /></div>
      <Modal visible={visible} onCancel={handleClose}>
        fgd
      </Modal>
    </Fragment>
  );
}
