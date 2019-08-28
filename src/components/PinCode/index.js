import React from 'react';
import styles from './index.less';

export default class PinCode extends React.Component {

  inputs = [
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
  ];

  getValue() {
    const { value } = this.props;
    // santilize value
    const newValue = (`${value}`).replace(/[^0-9]/g, '');

    if (newValue) {
      return (newValue + ' '.repeat(6)).substr(0, 6);
    }

    return ' '.repeat(6);
  }

  handleChangeDigit = (index) => (e) => {
    e.preventDefault();

    const { onChange } = this.props;

    // change focus
    if (e.keyCode === 37) { // <-
      if (index === 0) return;
      this.inputs[index - 1].current.focus();
      return;
    }

    if (e.keyCode === 39) { // ->
      if (index === this.inputs.length - 1) return;
      this.inputs[index + 1].current.focus();
      return;
    }

    if (e.keyCode >= 48 && e.keyCode <= 57) { // 0 -> 9
      const oldValue = this.getValue();

      if (index === 0) {
        const newValue = (e.key + oldValue).substr(0, this.inputs.length);
        onChange(newValue);
        this.inputs[index + 1].current.focus();
        return;
      }

      const newValue = (oldValue.substr(0, index) + e.key + oldValue.substr(index)).substr(0, this.inputs.length);
      onChange(newValue);

      if (index < this.inputs.length - 1) {
        this.inputs[index + 1].current.focus();
      }
      return;
    }

    if (e.keyCode === 8) { // backspace
      const oldValue = this.getValue();
      if (index === 0) {
        const newValue = oldValue.substr(1);
        onChange(newValue.trim());
        return;
      }

      if (index === this.inputs.length - 1) {
        const newValue = oldValue.substr(0, index);
        onChange(newValue.trim());
        this.inputs[index - 1].current.focus();
        return;
      }

      const newValue = oldValue.substr(0, index) + oldValue.substr(index + 1);
      onChange(newValue.trim());
      this.inputs[index - 1].current.focus();
      return;
    }

    if (e.keyCode === 46) { // delete
      const oldValue = this.getValue();
      if (index === this.inputs.length - 1) return;
      if (index === 0) {
        const newValue = oldValue.substr(index + 1);
        onChange(newValue.trim());
        return;
      }

      const newValue = oldValue.substr(0, index) + oldValue.substr(index + 2);
      onChange(newValue.trim());
    }
  }

  render() {
    const digits = this.getValue().split('');

    return (
      <div className={styles.container}>
        {digits.map((digit, index) => {
          return (
            <input className={styles.input} ref={this.inputs[index]} onPaste={(e) => e.preventDefault()} maxLength={1} minLength={0} value={digit} onKeyUp={this.handleChangeDigit(index)} />
          );
        })}
      </div>
    );
  }
}
