

import React, { useState } from 'react';
import IntlTelInput from 'react-intl-tel-input';
import cls from 'classnames';
import './main.less';
import styles from './index.less';

function TelInput({ value, onChange, onBlur }) {
  const [newValue, setNewValue] = useState(value || '');

  // if (('' + value).startsWith('+')) {

  // }

  // const { country_code,
  // national_number} = phoneUtil.parse(value);

  return (
    <IntlTelInput
      containerClassName={cls(['intl-tel-input', styles.container])}
      telInputProps={{ style: { width: '100%' } }}
      inputClassName="ant-input"
      value={newValue}
      format
      preferredCountries={['fr']}
      // eslint-disable-next-line react/jsx-no-duplicate-props
      onPhoneNumberChange={(valid, input) => {
        setNewValue(input.replace(/[^0-9+]/g, ''));
      }}
      onPhoneNumberBlur={(valid, input, code) => {
        if (!input) {
          onChange('');
          onBlur('');
          return;
        }

        if (`${input}`.startsWith('+')) {
          onChange(`${input}`.replace(' ', ''));
          onBlur(`${input}`.replace(' ', ''));
          return;
        }

        if (`${input}`.startsWith('0')) {
          onChange(`+${code.dialCode}${input.substr(1)}`);
          onBlur(`+${code.dialCode}${input.substr(1)}`);
          return;
        }

        onChange(`+${code.dialCode}${input}`);
        onBlur(`+${code.dialCode}${input}`);
      }}
    />
  );
}

// eslint-disable-next-line react/prefer-stateless-function
export default class PhoneNumberInput extends React.Component {
  render() {
    return <TelInput {...this.props} />;
  }
}
