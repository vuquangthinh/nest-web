import React from 'react';
import { formatMessage } from 'umi/locale';
import ChipStatus from '.';

export default function ChipCode({ code, formats, children, ...rest }) {
  if (formats[code]) {
    return (
      <ChipStatus {...formats[code]} {...rest}>
        {children || (formats[code].children || formatMessage({ id: 'common.status.suspended' }))}
      </ChipStatus>
    );
  }

  return <span />;
}

ChipCode.defaultProps = {
  formats: {
    1: {
      textColor: '#689f38',
      backgroundColor: '#dcedc8',
      get children() {
        return formatMessage({ id: 'common.status.published' });
      },
    },
    2: {
      textColor: '#ffa000',
      backgroundColor: '#ffecb3',
      get children() {
        return formatMessage({ id: 'common.status.draft' });
      },
    },
    3: {
      textColor: "#d32f2f" ,
      backgroundColor: "#ffcdd2",
      get children() {
        return formatMessage({ id: 'common.status.suspended' });
      },
    },
    4: {
      textColor: '#9e9e9e',
      backgroundColor: '#eeeeee',
      get children() {
        return formatMessage({ id: 'common.status.deleted' });
      },
    },
  },
};
