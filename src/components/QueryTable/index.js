import React from 'react';
import PropTypes from 'prop-types';
import useDataService from 'use-data-service';
import StandardTable from '../StandardTable';

export default function QueryTable({ service, params, columns, onChange }) {
  const [loading, data] = useDataService(service, params, onChange);

  return (
    <StandardTable
      loading={loading}
      data={data}
      columns={columns}
      onChange={onChange}
      query={location.query}
    />
  );
}

QueryTable.defaultProps = {
  onChange: () => { },
  params: {},
  columns: []
};

QueryTable.propTypes = {
  onChange: PropTypes.func,
  service: PropTypes.func.isRequired,
};