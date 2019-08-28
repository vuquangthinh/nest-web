import React from 'react';
import PropTypes from 'prop-types';
import styles from './Header.less';

export default function Header({ title, children, actions }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <div className={styles.meta}>{children}</div>
      </div>
      <div className={styles.actions}>{actions}</div>
    </div>
  );
}

Header.defaultProps = {
  title: '',
  actions: null,
  children: null
};

Header.propTypes = {
  title: PropTypes.string,
  actions: PropTypes.element,
  children: PropTypes.element,
};
