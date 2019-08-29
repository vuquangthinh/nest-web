import React, { Fragment } from 'react';
import { Spin } from 'antd';

export default function Dashboard() {
  return (
    <div style={{
      width: '100%',
      height: 'calc(100vh - 100px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Spin />
    </div>
  );
}
