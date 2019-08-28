import React from 'react';
import { formatMessage } from 'umi/locale';
import { Button } from 'antd';
import cls from 'classnames';
import styles from './index.less';

function handleFileChange(onChange) {
  return e => {
    if (onChange && e.target.files.length) {
      onChange(e.target.files[0]);
      return;
    }
    onChange(e.target.files[0]);
  };
}

function handleFileName(name) {
  if (name.length > 15) {
    const first = name.slice(0, 6);
    const last = name.slice(-6);
    return `${first} ... ${last}`;
  }
  return name;
}

function UploadButton({ value, onChange, disabled }) {
  if (disabled) {
    return (
      <Button block disabled>
        <i className="fa fa-cloud-upload-alt" />
        &nbsp;&nbsp;
        {formatMessage({ id: 'common.contractInput.button.upload' })}
      </Button>
    );
  }

  return (
    <div className={styles.button}>
      <Button block type={value instanceof File ? 'primary' : 'default'}>
        <i className="fa fa-cloud-upload-alt" />
        &nbsp;&nbsp;
        {value
          ? handleFileName(value.name)
          : formatMessage({ id: 'common.contractInput.button.upload' })}
      </Button>
      <input
        accept="application/pdf"
        className={styles.input}
        onChange={handleFileChange(onChange)}
        type="file"
      />
    </div>
  );
}

function ViewButton({ value, disabled }) {
  if (disabled || value === '') {
    return (
      <Button block disabled>
        {formatMessage({ id: 'common.contractInput.button.view' })}
      </Button>
    );
  }

  return (
    <a
      rel="noopener noreferrer"
      className={cls('ant-btn', 'ant-btn-block', styles.btnView)}
      href={value}
      target="_blank"
    >
      {formatMessage({ id: 'common.contractInput.button.view' })}
    </a>
  );
}

// eslint-disable-next-line react/prefer-stateless-function
export default class ContractInput extends React.Component {
  render() {
    const { value, onChange, disabled } = this.props;

    if (typeof value === 'string') {
      return <ViewButton disabled={disabled} value={value} />;
    }

    return <UploadButton value={value} onChange={onChange} disabled={disabled} />;
  }
}
