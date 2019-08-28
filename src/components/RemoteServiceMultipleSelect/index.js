import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import PropTypes from 'prop-types';
import DefaultSelection from '../DefaultSelection';

function getValue(attr, item) {
  if (typeof attr === 'string') {
    return item[attr];
  }

  if (typeof attr === 'function') {
    return attr(item);
  }

  throw new Error('Invalid property');
}

function RemoteServiceMultipleSelectImpl({
  Selection,
  value,
  attributeValue,
  attributeLabel,
  onChange,
  service,
  serviceOne,
  placeholder,
  children,
  resultValueAttribute,
  resultLabelAttribute,
  ...rest
}) {
  const [fetching, setFetching] = useState(false);
  const [data, setData] = useState([]);

  useEffect(
    () => {
      (async () => {
        setFetching(true);

        const result = await service({ search: '' });
        if (result.success) {
          const items = result.data.map(
            item => ({
              id: getValue(attributeValue, item),
              title: getValue(attributeLabel, item)
            }),
            {}
          );

          setData(items);
        }

        setFetching(false);
      })();
    },
    [value]
  );

  function handleSearch(query) {
    (async () => {
      const result = await service({ search: query });
      if (result.success) {
        setData(
          result.data.map(
            (item) => ({
              id: getValue(attributeValue, item),
              title: getValue(attributeLabel, item),
            }),
            {}
          )
        );
      }
    })();
  }

  let customValue = [];
  if (value) {
    customValue = value.map(item => ({
      key: getValue(resultValueAttribute, item),
      label: getValue(resultLabelAttribute, item)
    }));
  }

  return (
    <Selection
      loading={fetching}
      showSearch
      labelInValue
      mode="multiple"
      placeholder={placeholder}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      filterOption={false}
      onSearch={handleSearch}
      onChange={items => onChange(items.map(item => ({
        [resultLabelAttribute]: item.label,
        [resultValueAttribute]: item.key
      })))}
      items={data}
      value={customValue}
      {...rest}
    />
  );
}


// eslint-disable-next-line react/prefer-stateless-function
export default class RemoteServiceMultipleSelect extends React.Component {
  render() {
    return <RemoteServiceMultipleSelectImpl {...this.props} />
  }
}


RemoteServiceMultipleSelect.defaultProps = {
  Selection: DefaultSelection,
  attributeLabel: 'name',
  attributeValue: 'id',
  resultLabelAttribute: 'name',
  resultValueAttribute: 'id',
};

RemoteServiceMultipleSelect.propTypes = {
  Selection: PropTypes.any,
  attributeLabel: PropTypes.oneOf([
    PropTypes.string,
    PropTypes.func,
  ]),
  attributeValue: PropTypes.oneOf([
    PropTypes.string,
    PropTypes.func,
  ]),
  resultLabelAttribute: PropTypes.string,
  resultValueAttribute: PropTypes.string,
  service: PropTypes.func.isRequired,
};
