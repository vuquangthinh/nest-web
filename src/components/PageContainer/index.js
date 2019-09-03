import React, { useEffect, useContext } from 'react';
import { connect } from 'dva';
import GridContent from './GridContent';
import styles from './index.less';
import MenuContext from '@/layouts/MenuContext';
import PageContent from '../PageContent';
import { PageTitle } from '@/layouts/PageContext';
// import MenuContext from '@/layouts/MenuContext';

const PageContainer = ({ children, wrapperClassName, title }) => {
  return (
    <PageTitle title={title}>
      <div className={wrapperClassName}>
        {children ? (
          <div className={styles.content}>
            <GridContent>{children}</GridContent>
          </div>
        ) : null}
      </div>
    </PageTitle>
  );
}

export default PageContainer;