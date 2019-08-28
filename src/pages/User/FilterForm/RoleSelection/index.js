import React from 'react';
import FilterSelection from '@/components/FilterSelection';
import RemoteServiceSelect from '@/components/RemoteServiceSelect';
import { selection } from '@/services/role';

export default function RoleSelection(rest) {
  return <RemoteServiceSelect Selection={FilterSelection} service={selection} {...rest} />;
}
