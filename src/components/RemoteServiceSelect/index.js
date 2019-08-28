import React, { useState, useEffect, useRef } from 'react';
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

async function injectCurrentItemIfNotExist(serviceOne, value, items) {
  if (!serviceOne) return null;

  if (items.find(x => x.id === value)) {
    return null;
  }

  if (!value) return null;

  const response = await serviceOne({ id: value });
  if (response.success) {
    const {data} = response;
    return data;
  }

  return null;
}

function RemoveServiceSelectImpl({
  Selection,
  dropdownOnEmpty,
  value,
  attributeValue,
  attributeLabel,
  onChange,
  service,
  serviceOne,
  placeholder,
  children,
  ...rest
}) {
  const [fetching, setFetching] = useState(false);
  const [data, setData] = useState([]);

  const unmouted = useRef();

  useEffect(
    () => {
      (async () => {

        if (unmouted.current) return;

        setFetching(true);

        let result = { success: true, data: [] };
        if (dropdownOnEmpty) {
          result = await service({ search: '' });
        }

        if (unmouted.current) return;

          if (result.success) {
            const items = result.data.map(
              item => ({
                id: getValue(attributeValue, item),
                title: getValue(attributeLabel, item)
              }),
              {}
            );

            const currentItem = await injectCurrentItemIfNotExist(serviceOne, value, items);
            // console.log(currentItem)
            if (currentItem) {
              items.unshift({
                id: getValue(attributeValue, currentItem),
                title: getValue(attributeLabel, currentItem),
              });
            }
            setData(items);
          }

          setFetching(false);
      })();

      return () => {
        unmouted.current = true;
      }
    },
    [value, dropdownOnEmpty]
  );

  function handleSearch(query) {
    (async () => {
      if (query || dropdownOnEmpty) {
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
        return;
      }

      setData([]);
    })();
  }
  return (
    <Selection
      showSearch
      value={value}
      placeholder={placeholder}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      filterOption={false}
      onSearch={handleSearch}
      onChange={onChange}
      // dropdownClassName={styles}
      items={data}
      {...rest}
    />
  );
}


// eslint-disable-next-line react/prefer-stateless-function
export default class RemoteServiceSelect extends React.Component {
  render() {
    return <RemoveServiceSelectImpl {...this.props} />
  }
}


RemoteServiceSelect.defaultProps = {
  dropdownOnEmpty: false,
  Selection: DefaultSelection,
  attributeLabel: 'name',
  attributeValue: 'id',
  serviceOne: null
};

RemoteServiceSelect.propTypes = {
  dropdownOnEmpty: PropTypes.bool,
  Selection: PropTypes.any,
  attributeLabel: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  attributeValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  service: PropTypes.func.isRequired,
  serviceOne: PropTypes.func
};
