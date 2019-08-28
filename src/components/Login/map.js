import React from 'react';
import { Icon, Input } from 'antd';
import { formatMessage } from 'umi/locale';
import PinCode from '@/components/PinCode';
import styles from './index.less';

export default {
  PinCode: {
    props: {
      Element: PinCode,
      // prefix: <Icon type="user" className={styles.prefixIcon} />,
      placeholder: '',
    },
    rules: [
      {
        required: true,
        message: formatMessage({ id: 'module.login.pincode.required' }),
      },
    ],
  },
  UserName: {
    props: {
      // prefix: <Icon type="user" className={styles.prefixIcon} />,
      placeholder: 'admin',
    },
    rules: [
      {
        required: true,
        message: formatMessage({ id: 'module.login.username.required' }),
      },
    ],
  },
  Password: {
    props: {
      Element: Input.Password,
      // prefix: <Icon type="lock" className={styles.prefixIcon} />,
      type: 'password',
      placeholder: '888888',
    },
    rules: [
      {
        required: true,
        message: formatMessage({ id: 'module.login.password.required' }),
      },
    ],
  },
  Mobile: {
    props: {
      size: 'large',
      prefix: <Icon type="mobile" className={styles.prefixIcon} />,
      placeholder: 'mobile number',
    },
    rules: [
      {
        required: true,
        message: 'Please enter mobile number!',
      },
      {
        pattern: /^1\d{10}$/,
        message: 'Wrong mobile number format!',
      },
    ],
  },
  Captcha: {
    props: {
      size: 'large',
      prefix: <Icon type="mail" className={styles.prefixIcon} />,
      placeholder: 'captcha',
    },
    rules: [
      {
        required: true,
        message: 'Please enter Captcha!',
      },
    ],
  },
};
