import React, { Fragment, useState } from 'react';
import { formatMessage } from 'umi/locale';
import { Button } from 'antd';
import CreateDrawer from './CreateDrawer';

export default function CreateAction() {
  const [showDrawer, setShowDrawer] = useState(false);

  const handleShowDrawer = () => {
    setShowDrawer(true);
  };

  return (
    <Fragment>
      <Button type="primary" onClick={handleShowDrawer}>
        {formatMessage({ id: 'common.actions.create' })}
      </Button>
      <CreateDrawer visible={showDrawer} handleClose={() => setShowDrawer(false)} />
    </Fragment>
  );
}
