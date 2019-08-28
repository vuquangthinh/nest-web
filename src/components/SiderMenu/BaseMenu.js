import React, { useCallback, useMemo } from 'react';
import { Menu, Icon } from 'antd';

import Link from 'umi/link';
import memoizeOne from 'memoize-one';
import pathToRegexp from 'path-to-regexp';
import { urlToList } from '../_utils/pathTools';
import styles from './index.less';

const { SubMenu } = Menu;

const conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = icon => {
  if (typeof icon === 'string' && icon.indexOf('http') === 0) {
    return <img src={icon} alt="icon" className={styles.icon} />;
  }

  if (typeof icon === 'string' && icon.startsWith('fa::')) {
    return <i className={`fas fa-${icon.substr('fa::'.length)} ${styles.icon}`} />;
  }

  if (typeof icon === 'string' && icon.startsWith('fas::')) {
    return <i className={`fas fa-${icon.substr('fas::'.length)} ${styles.icon}`} />;
  }

  if (typeof icon === 'string') {
    return <Icon type={icon} />;
  }

  return icon;
};

export const getMenuMatches = (flatMenuKeys, path) =>
  flatMenuKeys.filter(item => {
    if (item) {
      return pathToRegexp(item).test(path);
    }
    return false;
  });

/**
 * Recursively flatten the data
 * [{path:string},{path:string}] => {path,path2}
 * @param  menus
 */
function getFlatMenuKeys(menus) {
  let keys = [];
  menus.forEach(item => {
    if (item.children) {
      keys = keys.concat(getFlatMenuKeys(item.children));
    }
    keys.push(item.path);
  });

  return keys;
}

const memoFlatMenuKeys = memoizeOne(getFlatMenuKeys);

function BaseMenu(props) {
  const {
    openKeys,
      theme,
      mode,
      Authorized,
      location: { pathname },
    menuData } = props;

  const flatMenuKeys = useMemo(() => getFlatMenuKeys(menuData), [menuData]);
  const getSelectedMenuKeys = useCallback(path => urlToList(path).map(itemPath => getMenuMatches(flatMenuKeys, itemPath).pop()), [flatMenuKeys]);

  const checkPermissionItem = useCallback((authority, ItemDom) => {
    if (Authorized && Authorized.check) {
      const { check } = Authorized;
      return check(authority, ItemDom);
    }
    return ItemDom;
  }, [ Authorized ]);

  const getNavMenuItems = useCallback((menusData, parent) => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => {
        // make dom
        // eslint-disable-next-line no-use-before-define
        const ItemDom = getSubMenuOrItem(item, parent);
        return checkPermissionItem(item.authority, ItemDom);
      })
      .filter(item => item);
  });

  const getMenuItemPath = useCallback(item => {
    const { name } = item;
    const itemPath = conversionPath(item.path);
    const icon = getIcon(item.icon);
    const { target } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {icon}
          <span>{name}</span>
        </a>
      );
    }

    const { location, isMobile, onCollapse } = props;
    return (
      <Link
        to={itemPath}
        target={target}
        replace={itemPath === location.pathname}
        onClick={
          isMobile
            ? () => {
                onCollapse(true);
              }
            : undefined
        }
      >
        {icon}
        <span>{name}</span>
      </Link>
    );
  });

  const getSubMenuOrItem = useCallback(item => {
    // doc: add hideChildrenInMenu
    if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
      const { name } = item;
      return (
        <SubMenu
          title={
            item.icon ? (
              <span>
                {getIcon(item.icon)}
                <span>{name}</span>
              </span>
            ) : (
              name
            )
          }
          key={item.path}
        >
          {getNavMenuItems(item.children)}
        </SubMenu>
      );
    }
    return <Menu.Item key={item.path}>{getMenuItemPath(item)}</Menu.Item>;
  });



    // if pathname can't match, use the nearest parent's key
    let selectedKeys = getSelectedMenuKeys(pathname);
    if (!selectedKeys.length && openKeys) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }

    let menuProps = {};
    if (openKeys) {
      menuProps = {
        openKeys,
      };
    }

    const { handleOpenChange, style } = props;

    return (
      <Menu
        key="Menu"
        mode={mode}
        theme={theme}
        onOpenChange={handleOpenChange}
        selectedKeys={selectedKeys}
        style={style}
        className={mode === 'horizontal' ? 'top-nav-menu' : ''}
        {...menuProps}
      >
        {getNavMenuItems(menuData)}
      </Menu>
    );
}

export default React.memo(BaseMenu);
