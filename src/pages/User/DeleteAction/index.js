import React from 'react';
import { formatMessage } from 'umi/locale';
import IconButton from '@/components/IconButton';
import PopModal from '@/components/PopModal/Remove';
import model from '../models';

function DeleteAction({ id }) {
  return (
    <PopModal action={`${model.namespace}/remove`} id={id}>
      <IconButton title={formatMessage({ id: 'common.action.delete.tooltip.name' })} icon="fa::trash" />
    </PopModal>
  );
}



export default DeleteAction;
