import React from 'react';
import { Button, Popover, Icon } from 'antd';
import { SketchPicker } from 'react-color';
import styles from './index.less';

class ColorPicker extends React.Component {
  handleChangeComplete = color => {
    const { onChange } = this.props;
    onChange(color.hex);
  };

  render() {
    const { type, value } = this.props;
    return (
      <Popover
        className={styles.container}
        overlayClassName={styles.popover}
        placement="bottomRight"
        content={
          <SketchPicker
            color={value || '#4f4f4f'}
            onChangeComplete={this.handleChangeComplete}
          />
        }
        trigger="click"
      >
        <Icon
          type={type}
          className={styles.icon}
        />
        <Button className={styles.preview} style={{ backgroundColor: value }} />
      </Popover>
    );
  }
}

export default ColorPicker;
