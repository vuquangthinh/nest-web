/* eslint-disable */
import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi/locale';
import { Spin, Menu, Icon, Dropdown, Avatar } from 'antd';
import moment from 'moment';
// import groupBy from 'lodash/groupBy';
import Notification from './Notification';
import  { getAuthority } from '@/utils/authority';
// import HeaderSearch from '../../HeaderSearch';
import SelectLang from '../../SelectLang';
import styles from '../index.less';


export default class GlobalHeaderRight extends PureComponent {
  // getNoticeData() {
  //   const { notices = [] } = this.props;
  //   if (notices.length === 0) {
  //     return {};
  //   }
  //   const newNotices = notices.map(notice => {
  //     const newNotice = { ...notice };
  //     if (newNotice.datetime) {
  //       newNotice.datetime = moment(notice.datetime).fromNow();
  //     }
  //     if (newNotice.id) {
  //       newNotice.key = newNotice.id;
  //     }
  //     if (newNotice.extra && newNotice.status) {
  //       const color = {
  //         todo: '',
  //         processing: 'blue',
  //         urgent: 'red',
  //         doing: 'gold',
  //       }[newNotice.status];
  //       newNotice.extra = (
  //         <Tag color={color} style={{ marginRight: 0 }}>
  //           {newNotice.extra}
  //         </Tag>
  //       );
  //     }
  //     return newNotice;
  //   });
  //   return groupBy(newNotices, 'type');
  // }

  render() {
    const { identity, onMenuClick, theme } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        {/* <Menu.Item key="userCenter">
          <Icon type="user" />
          <FormattedMessage id="menu.account.center" defaultMessage="account center" />
        </Menu.Item> */}
        <Menu.Item key="push:/account/settings/base">
          <Icon type="setting" />
          <FormattedMessage id="menu.account.settings" defaultMessage="Account settings" />
        </Menu.Item>
        <Menu.Item key="push:/account/settings/security">
          <Icon type="credit-card" />
          <FormattedMessage id="menu.account.security" defaultMessage="Security" />
        </Menu.Item>
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="Logout" />
        </Menu.Item>
      </Menu>
    );
    // const noticeData = this.getNoticeData();
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }

    return (
      <div className={className}>
        {/* <HeaderSearch /> */}
        {/* <Tooltip title={formatMessage({ id: 'component.globalHeader.help' })}>
          <a target="_blank" href="/contact" rel="noopener noreferrer" className={styles.action}>
            <Icon type="question-circle-o" />
          </a>
        </Tooltip> */}

        {/* <Notification /> */}

        {identity ? (
          <Dropdown overlay={menu} placement="topRight">
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar size="default" className={styles.avatar} src={identity.avatar} alt="avatar" />
              <div className={styles.nameContainer}>
                <span className={styles.name}>{identity.username || identity.id}</span>
                <span className={styles.nameNote}>{identity.username || identity.id}</span>
              </div>
            </span>
          </Dropdown>
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        )}
        <SelectLang className={styles.action} />
      </div>
    );
  }
}
