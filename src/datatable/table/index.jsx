import React from 'react';
import PropTypes from 'prop-types';

import {Card, DataTable, Checkbox, AppProvider} from '@shopify/polaris';
import * as _ from 'lodash';

import * as styles from './styles.css';


const FfDataTable = (props) => {
  const {
    rows, columns, onRowClick, onSelectRow, selectedRows,
    onSort, trackSelectionBy, sortOrder
  } = props;

  const renderRows = (rowData, rowIndex) => {
    const formattedRow = [];
    var isSelected = _.find(selectedRows, index => index === rowIndex ) >= 0;

    _.forEach(rowData, (rowElement, index) => {
      if ((rowData.length - columns.length === 1) && (index === trackByIndex)) {
        return;
      } else {
        formattedRow.push (<span key={index} onClick={() => onRowClick(rowIndex)}>{ rowElement }</span>);
      }
    });

    formattedRow.unshift (<Checkbox checked={isSelected} onChange={() => onSelectRow(rowIndex)} />);

    return formattedRow;
  }

  const onColumnSort = (index, direction) => {
    const column = columns[index - 1].key;
    onSort(column, direction);
  }

  var trackByIndex = -1;
  const columnContentTypes = [], columnHeadings = [], columnSortable = [], formattedRows= [];
  const isSelectAll = (selectedRows && selectedRows.length) === (rows && rows.length);

  const sortedColumnIndex = _.findIndex(columns, col => col.key === sortOrder.field);
  const sortDirection = sortOrder.order;

  _.each(columns, column => {
    trackByIndex = trackByIndex < 0 && column.key === trackSelectionBy ? index : 0;
    columnContentTypes.push(column.type);
    columnHeadings.push(column.displayName);
    columnSortable.push(column.sortable);
  })

  columnContentTypes.unshift('string');
  columnSortable.unshift(false);
  columnHeadings.unshift(<Checkbox checked={isSelectAll} onChange={props.onSelectAll} />);

  _.forEach(_.map(rows, row => _.values(row)), (row, index) => {
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

FfDataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      displayName: PropTypes.string,
      key: PropTypes.string,
      sortable: PropTypes.bool,
      type: PropTypes.string
    })
  ),
  onSort: PropTypes.func,
  onSelectAll: PropTypes.func,
  rows: PropTypes.arrayOf(
    PropTypes.object
  ),
  selectedRows: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ])
  ),
  onSelectrow: PropTypes.func,
  onRowClick: PropTypes.func,
  trackSelectionBy: PropTypes.string,
  sortOrder: PropTypes.shape({
    field: PropTypes.string,
    order: PropTypes.oneOf(['ascending', 'descending'])
  })
};

export default FfDataTable;