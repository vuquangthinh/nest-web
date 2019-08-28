/* eslint-disable */
import React from 'react';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
// import Link from 'umi/link';
// import { Icon } from 'antd';
// import GlobalFooter from '@/components/GlobalFooter';
// import SelectLang from '@/components/SelectLang';
import styles from './AuthLayout.less';

const links = [
  {
    key: 'help',
    title: formatMessage({ id: 'layout.user.link.help' }),
    href: '/contact',
  },
  {
    key: 'privacy',
    title: formatMessage({ id: 'layout.user.link.privacy' }),
    href: '/privacy',
  },
  {
    key: 'terms',
    title: formatMessage({ id: 'layout.user.link.terms' }),
    href: '/terms',
  },
];

@connect(state => ({ application: state.global.application }))
export default class AuthLayout extends React.PureComponent {
  render() {
    const {
      children,
      // application
    } = this.props;
    return (
      // @TODO <DocumentTitle title={this.getPageTitle()}>
      <div className={styles.container}>
        {/* <div className={styles.lang}>
          <SelectLang />
        </div> */}
        <div className={styles.content}>
          {/*
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>{application.name}</span>
              </Link>
            </div>
            <div className={styles.desc}>{application.description}</div>
          </div>
          */}
          {children}
        </div>
        {/* <GlobalFooter
          links={links}
          copyright={
            <Fragment>
              Copyright <Icon type="copyright" />
              {application.year} {application.copyright}
            </Fragment>
          }
        /> */}
      </div>
    );
  }
}
