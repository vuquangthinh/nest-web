import React from 'react';
import { formatMessage } from 'umi/locale';
import IconButton from '@/components/IconButton';
import PopModal from '@/pages/User/ChangePassword';
import model from '../models';

function ChangePasswordAction({ id }) {
  return (
    <PopModal action={`${model.namespace}/changePassword`} id={id}>
      <IconButton title={formatMessage({ id: 'common.action.changePass.tooltip.name' })} icon="fa::unlock-alt" />
    </PopModal>
  );
}

export default ChangePasswordAction;
