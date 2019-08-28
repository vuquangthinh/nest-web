import React from 'react';
import ChipCodeBase from '@/components/ChipStatus/ChipCode';
import { formatMessage } from 'umi/locale';

export default function ChipCode({ code }) {
  return (
    <ChipCodeBase
      code={code}
      formats={{
        1: {
          textColor: '#689f38',
          backgroundColor: '#dcedc8',
          get children() {
            return formatMessage({ id: 'UserStatus.ACTIVE' });
          },
        },
        3: {
          textColor: "#d32f2f" ,
          backgroundColor: "#ffcdd2",
          get children() {
            return formatMessage({ id: 'UserStatus.SUSPENDED' });
          },
        },
        2: {
          textColor: '#9e9e9e',
          backgroundColor: '#eeeeee',
          get children() {
            return formatMessage({ id: 'UserStatus.DELETED' });
          },
        },
      }}
    />
  );
}
