import React, { useMemo } from 'react';
import { connect } from 'dva';
import FilterSelection from '@/components/FilterSelection';
import { EMPTY_ARRAY } from '@/constants';
import { formatMessage } from 'umi/locale';

function StatusSelection({ data, ...rest }) {
  const items = useMemo(
    () =>
      data.map(
        ({ id, title }) => ({
          id,
          title: formatMessage({ id: title }),
        }),
        {}
      ),
    data
  );

  return <FilterSelection {...rest} items={items} />;
}

export default connect(state => ({
  data: state.constant.UserStatus || EMPTY_ARRAY,
}))(StatusSelection);
