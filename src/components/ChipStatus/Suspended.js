import React from 'react';
import { formatMessage } from 'umi/locale';
import ChipStatus from '.';

export default function Suspended({ children }) {
  return (
    <ChipStatus textColor="#ffa000" backgroundColor="#ffecb3">
      {children || formatMessage({ id: 'common.status.suspended' })}
    </ChipStatus>
  );
}
