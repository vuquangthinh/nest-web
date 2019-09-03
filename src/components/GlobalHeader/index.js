import React, { useMemo, Fragment, useContext } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import styles from './index.less';
import RightContent from './RightContent';
import PageContext from '@/layouts/PageContext';


function GlobalHeader(props) {
  const [title] = useContext(PageContext);
  const { isMobile, collapsed, logo, application } = props;

  const Logo = useMemo(() => (
    collapsed &&
    <Fragment>
      {isMobile && (
        <Link to="/" className={styles.logo} key="logo">
          <img src={logo} alt="logo" width="32" />
        </Link>
      )}
      {/* <span className={styles.appName}>{application.headerName}</span> */}
    </Fragment>
  ), [logo, isMobile, collapsed]);

  return (
    <div className={styles.header}>
      {Logo}

      <span className={styles.appPageTitle}>{title}</span>
      <RightContent {...props} />
    </div>
  );
}

export default connect(state => ({
  application: state.global.application,
}))(GlobalHeader)
