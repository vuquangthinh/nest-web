import React from 'react';
import { Icon, Tooltip } from 'antd';
import styles from './index.less';

export default function IconButton({ icon, title, ...rest }) {
  if (!icon) {
    return <span />;
  }

  if (icon.startsWith('fa::')) {
    return  (
      <Tooltip placement="bottom" title={title}>
        <i className={`${styles.icon} fas fa-${icon.substr('fa::'.length)}`} {...rest} />
      </Tooltip>
    )

  }

  if (icon.startsWith('far::')) {
    return  (
      <Tooltip placement="bottom" title={title}>
        <i className={`${styles.icon} far fa-${icon.substr('far::'.length)}`} {...rest} />
      </Tooltip>
    )
  }

  return <Tooltip placement="bottom" title={title}><Icon type={icon} {...rest} /></Tooltip>
}
