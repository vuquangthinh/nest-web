import React from 'react';
import { formatMessage } from 'umi/locale';
import styles from './index.less';

export default function SimplePagination({ current, total, resource, onChange, pageSize }) {
  const page = current ? parseInt(current, 10) : 1;
  if (!total) return <div />;
  if ((page - 1) * pageSize + 1 > total) return <div />;

  return (
    <div className={styles.container}>
      <div
        className={styles.note}
        dangerouslySetInnerHTML={{
          __html: formatMessage(
            { id: 'common.pagination.note' },
            {
              page,
              start: (page - 1) * pageSize + 1,
              end: Math.min(total, (page - 1) * pageSize + pageSize),
              total,
              resource,
            }
          ),
        }}
      />
      <div className={styles.actions}>
        {page > 1 && (
          <span
            className="fas fa-angle-left"
            onClick={() => {
              onChange(page - 1);
            }}
          />
        )}
        <span>{formatMessage({ id: 'common.pagination.current' }, { page })}</span>
        {(page - 1) * pageSize + pageSize < total && (
          <span
            className="fas fa-angle-right"
            onClick={() => {
              onChange(page + 1);
            }}
          />
        )}
      </div>
    </div>
  );
}

SimplePagination.defaultProps = {
  pageSize: 10,
  resource: 'data',
};
