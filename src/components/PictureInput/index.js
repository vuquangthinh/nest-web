import React, { useState, useEffect } from 'react';
import { Spin, Empty } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import { getBase64 } from '@/utils/utils';

function PictureInputImpl({ onChange, value, upload, remove, children, disable, ...props }) {
  const [preview, setPreview] = useState(undefined);
  const [reRenderInput, setReRenderInput] = useState(1);

  useEffect(
    () => {
      if (value instanceof File) {
        setPreview(() => {
          (async () => {
            const b64 = await getBase64(value, true);
            setPreview(b64);
          })();
          return true;
        });

        return;
      }

      if (value) {
        setPreview(value);
      } else {
        setPreview(null);
      }
    },
    [value]
  );

  function handleFileChange(e) {
    if (e.target.files.length > 0) {
      onChange(e.target.files[0]);
    }
  }

  function handlePreview(res) {
    return <img className={styles.image} src={res} alt="" />;
  }

  function handleRemoveFile() {
    onChange('');
    setReRenderInput(0);
    setTimeout(() => {
      setReRenderInput(1);
    }, 100);
  }

  function renderPreview() {
    if (preview === null) {
      return (
        <div className={styles.image}>
          <Empty description={false} />
        </div>
      );
    }

    if (preview === undefined) {
      return (
        <div className={styles.image}>
          <Spin />
        </div>
      );
    }

    return handlePreview(preview);
  }

  return (
    <div className={styles.container} {...props}>
      <div className={styles.preview}>
        {renderPreview()}
      </div>
      { !disable &&
      <div className={styles.actions}>
        <div className={`${styles.uploadField} action-link`}>
          <span
            style={{
              cursor: 'pointer',
              pointerEvents: 'none',
            }}
          >
            {upload}
          </span>
          {reRenderInput ? <input accept="image/*" capture type="file" onChange={handleFileChange} /> : (<div />)}
        </div>
        <div className="action-link" onClick={handleRemoveFile}>
          {remove}
        </div>
      </div>
      }
    </div>
  );
}

PictureInputImpl.defaultProps = {
  get upload() {
    return formatMessage({ id: 'common.pictureInput.upload' });
  },
  get remove() {
    return formatMessage({ id: 'common.pictureInput.remove' });
  },
};


// eslint-disable-next-line react/prefer-stateless-function
export default class PictureInput extends React.Component {
  render() {
    return (<PictureInputImpl {...this.props} />);
  }
}
