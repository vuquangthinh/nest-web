import React from 'react';
import { formatMessage } from 'umi/locale';
import HeaderSearch from '../../HeaderSearch';

import styles from '../index.less';

export default () => (
  <HeaderSearch
    className={`${styles.action} ${styles.search}`}
    placeholder={formatMessage({ id: 'component.globalHeader.search' })}
    dataSource={[
      formatMessage({ id: 'component.globalHeader.search.example1' }),
      formatMessage({ id: 'component.globalHeader.search.example2' }),
      formatMessage({ id: 'component.globalHeader.search.example3' }),
    ]}
    onSearch={value => {
      console.log('input', value); // eslint-disable-line
    }}
    onPressEnter={value => {
      console.log('enter', value); // eslint-disable-line
    }}
  />
);
