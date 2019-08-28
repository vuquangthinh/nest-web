// import React, { PureComponent } from 'react';
// import { formatMessage, setLocale, getLocale } from 'umi/locale';
import { getLocale } from 'umi/locale';
import moment from 'moment';
// import { Menu, Icon, Dropdown } from 'antd';
// import classNames from 'classnames';
// import styles from './index.less';

moment.locale(getLocale());

export default () => null;

// export default class SelectLang extends PureComponent {
//   changLang = ({ key }) => {
//     setLocale(key);
//     moment.locale(key);
//   };

//   render() {
//     return null;

//     const { className } = this.props;
//     const selectedLang = getLocale();
//     const langMenu = (
//       <Menu className={styles.menu} selectedKeys={[selectedLang]} onClick={this.changLang}>
//         <Menu.Item key="vi-VN">
//           <span role="img" aria-label="Vietnamese">
//             🇻🇳
//           </span>{' '}
//           Tiếng Việt
//         </Menu.Item>
//         {/* <Menu.Item key="en-US">
//           <span role="img" aria-label="English">
//             🇬🇧
//           </span>{' '}
//           English
//         </Menu.Item> */}
//       </Menu>
//     );
//     return (
//       <Dropdown overlay={langMenu} placement="bottomRight">
//         <Icon
//           type="global"
//           className={classNames(styles.dropDown, className)}
//           title={formatMessage({ id: 'navBar.lang' })}
//         />
//       </Dropdown>
//     );
//   }
// }
