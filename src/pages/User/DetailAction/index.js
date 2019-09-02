import React from 'react';
import { formatMessage } from 'umi/locale';
import IconButton from '@/components/IconButton';
import PopModal from '@/pages/User/ChangePassword';
import model from '../models';
import Link from 'umi/link';

function DetailAction({ id }) {
  return (
    <Link to={`users/${id}`}>
      <IconButton title={formatMessage({ id: 'common.action.changePass.tooltip.name' })} icon="fa::user-cog" />
    </Link>
  );
}

export default DetailAction;
