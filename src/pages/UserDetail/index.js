import React, { useState } from 'react';
import { formatMessage } from 'umi/locale';
import PageContainer from '@/components/PageContainer';

export default function UserDetail() {
  const [title, setTitle] = useState();

  return <PageContainer title={formatMessage({ id: 'module.userdetail.pageTitle' }, {
    title,
  })}>
    sdfdf
  </PageContainer>
}