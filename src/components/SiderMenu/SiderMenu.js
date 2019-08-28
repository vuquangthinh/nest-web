import React, { useCallback, useState, useEffect} from 'react';
import { Layout,
  //  Menu, Icon
  } from 'antd';
import ScrollView from 'react-scrollbar';
import { connect } from 'dva';
import pathToRegexp from 'path-to-regexp';
// import { formatMessage } from 'umi/locale';
import classNames from 'classnames';
import Link from 'umi/link';
import BaseMenu, { getMenuMatches } from './BaseMenu';
import { urlToList } from '../_utils/pathTools';

import styles from './index.less';

const { Sider } = Layout;

/**
 * @memberof SiderMenu
 */
const getDefaultCollapsedSubMenus = props => {
  const {
    location: { pathname },
    flatMenuKeys,
  } = props;

  return urlToList(pathname)
    .map(item => getMenuMatches(flatMenuKeys, item)[0])
    .filter(item => item);
};

/**
 * Recursively flatten the data
 * [{path:string},{path:string}] => {path,path2}
 * @param  menu
 */
export const getFlatMenuKeys = menu =>
  menu.reduce((keys, item) => {
    keys.push(item.path);
    if (item.children) {
      return keys.concat(getFlatMenuKeys(item.children));
    }
    return keys;
  }, []);

/**
 * Find all matched menu keys based on paths
 * @param  flatMenuKeys: [/abc, /abc/:id, /abc/:id/info]
 * @param  paths: [/abc, /abc/11, /abc/11/info]
 */
export const getMenuMatchKeys = (flatMenuKeys, paths) =>
  paths.reduce(
    (matchKeys, path) =>
      matchKeys.concat(flatMenuKeys.filter(item => pathToRegexp(item).test(path))),
    []
  );

const SiderMenu = (props) => {
  const {
    location,
    logo,
    collapsed,
    onCollapse,
    fixSiderbar,
    theme,
    application,
    menuData
  } = props;
  const [openKeys, setOpenKeys] = useState(getDefaultCollapsedSubMenus(props));
  const defaultProps = collapsed ? {} : { openKeys };

  const siderClassName = classNames(styles.sider, {
    [styles.fixSiderbar]: fixSiderbar,
    [styles.light]: theme === 'light',
  });

  useEffect(() => {
    setOpenKeys(getDefaultCollapsedSubMenus(props));
  }, [location.pathname]);

  const isMainMenu = useCallback(key => menuData.some(item => {
    if (key) {
      return item.key === key || item.path === key;
    }
    return false;
  }), [ menuData ]);

  const handleOpenChange = useCallback(oks => {
    const moreThanOne = oks.filter(openKey => isMainMenu(openKey)).length > 1;
    setOpenKeys(moreThanOne ? [oks.pop()] : [...oks]);
  });

  const handleToggleCollapse = useCallback((e) => {
    // ant-menu-item
    if (e.target.closest('.ant-menu-item') || e.target.closest('.ant-menu-submenu')) {
      return; // ignore
    }

    onCollapse(!collapsed);
  }, [collapsed]);

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={256}
      theme={theme}
      className={siderClassName}
    >
      <div className={styles.logo} id="logo">
        <Link to="/">
          <img src={logo} alt="logo" />
          <h1>{application.name}</h1>
        </Link>
      </div>

      <div onClick={handleToggleCollapse}>
        <ScrollView horizontal={false} className={styles.scrollContainer}>
          <BaseMenu
            {...props}
            mode="inline"
            handleOpenChange={handleOpenChange}
            onOpenChange={handleOpenChange}
            style={{ padding: '16px 0', width: '100%', overflowX: 'hidden' }}
            {...defaultProps}
          />
        </ScrollView>
      </div>
    </Sider>
  );
}

export default connect(({ global }) => ({
  application: global.application
}))(SiderMenu);
