import React, { PureComponent, Fragment } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import styles from './index.less';
import RightContent from './RightContent';
import MenuContext from '@/layouts/MenuContext';

@connect(state => ({
  application: state.global.application,
}))
export default class GlobalHeader extends PureComponent {

  renderLogo() {
    const { isMobile, collapsed, logo, application } = this.props;

    if (!collapsed) {
      return null;
    }

    return (
      <Fragment>
        {isMobile && (
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>
        )}
        {/* <span className={styles.appName}>{application.headerName}</span> */}
      </Fragment>
    );
  }

  render() {
    return (
      <div className={styles.header}>
        {this.renderLogo()}

        <MenuContext.Consumer>
          {value => <span className={styles.appPageTitle}>{value.pageTitle}</span>}
        </MenuContext.Consumer>

        <RightContent {...this.props} />
      </div>
    );
  }
}
