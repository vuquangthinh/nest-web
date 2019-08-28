import React from 'react';
import PropTypes from 'prop-types';
import styles from './MetaDetail.less';

export default function MetaDetail({ items }) {
  return (
    <div className={styles.container}>
      {items.map(({ label, value }, index) => (
        <div className={styles.item} key={String(index)}>
          <div className="title">{label}:</div>
          <div className="value">{value}</div>
        </div>
      ))}
    </div>
  );
}

MetaDetail.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.any,
    })
  ).isRequired,
};
