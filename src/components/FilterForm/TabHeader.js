import React from 'react';
import PropTypes from 'prop-types';

export default class TabHeader extends React.Component {

  static propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    })),

    onFilter: PropTypes.func,
  };

  static defaultProps = {
    tabs: [],
    onFilter: () => {}
  }

  render() {
    return <div>
      render tab
      render filter button
    </div>
  }
}