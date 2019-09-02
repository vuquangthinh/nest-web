import React from 'react';
// import { FormattedMessage } from 'umi/locale';
// import Link from 'umi/link';
// import PageHeader from '@/components/PageHeader';
import { connect } from 'dva';
import GridContent from './GridContent';
import styles from './index.less';
// import MenuContext from '@/layouts/MenuContext';

const PageHeaderWrapper = ({ children, contentWidth, wrapperClassName, top, ...restProps }) => (
  <div className={wrapperClassName}>
    {/* {top} */}
    {children ? (
      <div className={styles.content}>
        <GridContent>{children}</GridContent>
      </div>
    ) : null}
  </div>
);

PageHeaderWrapper.defaultProps = {
  hiddenBreadcrumb: true,
};

export default connect(({ setting }) => ({
  contentWidth: setting.contentWidth,
}))(PageHeaderWrapper);
