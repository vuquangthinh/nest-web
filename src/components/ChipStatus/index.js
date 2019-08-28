import React from 'react';
import cls from 'classnames';
import styles from './styles.less';

export default function ChipStatus({ backgroundColor, textColor, children, className }) {
  return (
    <span
      className={cls(styles.chip, className)}
      style={{
        backgroundColor,
        color: textColor,
      }}
    >
      {children}
    </span>
  );
}
