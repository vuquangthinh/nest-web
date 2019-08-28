import React from 'react';
import { Form } from 'antd';
import styles from './index.less';

export default function FilterForm({ visible, children, handleSubmit }) {

  if (!visible) {
    return <div />;
  }

  return (
    <Form
      className={styles.container}
      onSubmit={e => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      {children}
    </Form>
  );
}
