import React, { Fragment, useState } from 'react';
import { formatMessage } from 'umi/locale';
import IconButton from '@/components/IconButton';
import UpdateDrawer from './UpdateDrawer';

export default function UpdateAction({ id }) {
  const [showDrawer, setShowDrawer] = useState(false);

  const handleShowDrawer = () => {
    setShowDrawer(true);
  };

  return (
    <Fragment>
      <IconButton title={formatMessage({ id: 'common.action.update.tooltip.name' })} icon="far::edit" onClick={handleShowDrawer} />
      <UpdateDrawer id={id} visible={showDrawer} handleClose={() => setShowDrawer(false)} />
    </Fragment>
  );
}
