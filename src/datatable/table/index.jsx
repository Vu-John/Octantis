import React from 'react';
import PropTypes from 'prop-types';

import {Card, DataTable, Checkbox, AppProvider} from '@shopify/polaris';
import * as _ from 'lodash';

import * as styles from './styles.css';


const FfDataTable = (props) => {
  const {
    rows, columns, onRowClick, onSelectionChange, selectedRows,
    onSortChange, trackSelectionBy, sortBy
  } = props;

  const renderRows = (rowData, rowIndex) => {
    const formattedRow = [];
    var isSelected = _.find(selectedRows, index => index === rowIndex ) >= 0;

    formattedRow.push (<Checkbox checked={isSelected} onChange={() => onSelectionChange(rowIndex)} />);

    _.forEach(rowData, (value, key) => {
      if (key === trackSelectionBy) {
        return;
      } else {
        formattedRow.push (<div className={styles.cellElement} key={key} onClick={() => onRowClick(rowIndex)}>{ value }</div>);
      }
    });

    return formattedRow;
  }

  const onColumnSort = (index, direction) => {
    const column = columns[index - 1].key;
    onSortChange(column, direction);
  }

  const columnContentTypes = [],
    columnHeadings = [],
    columnSortable = [],
    formattedRows = [];
  const isSelectAll = (selectedRows && selectedRows.length) === (rows && rows.length);

  const sortedColumnIndex = _.findIndex(columns, col => col.key === sortBy.field);
  const sortDirection = sortBy.order;

  columnContentTypes.push('string');
  columnSortable.push(false);
  columnHeadings.push(<Checkbox checked={isSelectAll} onChange={() => props.onSelectionChange(rows.length + 1)} />);

  _.each(columns, column => {
    columnContentTypes.push(column.type);
    columnHeadings.push(column.displayName);
    columnSortable.push(column.sortable);
  })

  _.forEach(rows, (row, index) => {
    formattedRows.push(renderRows(row, index));
  });

  return (
    <AppProvider>
      <Card>
        <DataTable
          columnContentTypes={ columnContentTypes }
          headings={ columnHeadings }
          sortable={ columnSortable }
          rows={ formattedRows }
          onSort={ onColumnSort }
          defaultSortDirection={ sortDirection }
          initialSortColumnIndex={ sortedColumnIndex }
        />
        {
          !rows.length ?
            <div className={styles.noRecords}>
              No Records found
            </div> : null
        }
      </Card>
    </AppProvider>
  );
}

FfDataTable.defaultProps = {
  trackSelectionBy: 'id'
}

FfDataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      displayName: PropTypes.string,
      key: PropTypes.string,
      sortable: PropTypes.bool,
      type: PropTypes.string
    })
  ),
  onSortChange: PropTypes.func,
  rows: PropTypes.arrayOf(
    PropTypes.object
  ),
  selectedRows: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ])
  ),
  onSelectionChange: PropTypes.func,
  onRowClick: PropTypes.func,
  trackSelectionBy: PropTypes.string,
  sortBy: PropTypes.shape({
    field: PropTypes.string,
    order: PropTypes.oneOf(['ascending', 'descending'])
  })
};

export default FfDataTable;