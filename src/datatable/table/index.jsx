import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow
} from '@material-ui/core';
import { Checkbox } from '@shopify/polaris';

import TableHeader from '../header/index.jsx';
import TablePaginator from '../paginator/index.jsx';

import * as styles from './styles.css';


const themeStyles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  tableCell: {
    fontSize: 'inherit',
    whiteSpace: 'pre',
    fontFamily: 'ubuntu',
    padding: '4px 2.5vw',
    cursor: 'pointer'
  }
});

const _onRowClick = (rowData, onRowClick, event) => {
  onRowClick(event, rowData)
}

const stopEventPropogation = (event) => {
  event.stopPropagation();
}

const renderRows =
 (rowData, columns, onRowClick,
    onSelectRecord, onSelectAll, classes) => {

  const _onSelectRow = (checked) => {
    onSelectRecord(checked, rowData);
  }

  return (
    <TableRow
      classes={{ root: styles.row, selected: styles.rowselect, hover: styles.rowhover }}
      hover
      onClick={_onRowClick.bind(this, rowData, onRowClick, event)}
      role="checkbox"
      aria-checked={rowData.isSelected}
      tabIndex={-1}
      key={rowData.id}
      selected={rowData.isSelected}
    >
      {
        onSelectAll ?
          <TableCell padding="checkbox">
            <span onClick={stopEventPropogation}>
              <Checkbox checked={rowData.isSelected} onChange={_onSelectRow} />
            </span>
          </TableCell> : null
      }
      {
        columns && columns.map(column => {
          return renderCell(rowData[column.key], classes)
        })
      }
    </TableRow>
  );
}

const renderCell = (cellData, classes) => {

  return (
    <TableCell key={cellData} classes={{ body: classes.tableCell }}>
      {cellData}
    </TableCell>
  )
}

var TableData = (props) => {

  var {
    classes, columns, records, onRowClick,
    orderAs, orderBy, selectedRecords, onSelectRecord,
    onSort, onSelectAll, rowsPerPage, rowsPerPageOptions,
    onRowChange, currentPage, onPageChange,
    totalRecords
  } = props;

  const selectAll = (records && records.length) === (selectedRecords && selectedRecords.length);

  return (
    <Paper className={classes.root}>
      <div className={classes.tableWrapper}>
        <Table className={classes.table} aria-labelledby="tableTitle">
          {columns && columns.length ?
            <TableHeader
              selectAll={selectAll}
              onSort={onSort}
              onSelectAll={onSelectAll}
              orderAs={orderAs}
              orderBy={orderBy}
              columns={columns}
            /> : null}
          <TableBody>
            {
              records && records
                .map(rowData => {
                  rowData.isSelected = selectedRecords &&
                    selectedRecords.indexOf(rowData.id) !== -1;

                  return renderRows(rowData, columns, onRowClick,
                    onSelectRecord, onSelectAll, classes)
                })
            }
          </TableBody>
        </Table>
      </div>
      <TablePaginator
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        onRowChange={onRowChange}
        currentPage={currentPage}
        onPageChange={onPageChange}
        totalRecords={totalRecords}
      />
    </Paper>
  );
}

TableData.propTypes = {
  classes: PropTypes.object.isRequired,
};

TableData = withStyles(themeStyles)(TableData);

function DataTable(props) {

  // withStyles method adds its own props and that's why we are creating a wrapper to set our props
  return <TableData {...props} />
}

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      hide: PropTypes.bool,
      displayName: PropTypes.string,
      sortable: PropTypes.bool,
      key: PropTypes.string,
      numeric: PropTypes.bool
    })
  ),
  onSort: PropTypes.func,
  /** Callback when selectall checkbox is clicked */
  onSelectAll: PropTypes.func,
  /** Variable to set type of sorting is done */
  orderAs: PropTypes.oneOf(['asc', 'desc']),
  /** Variable which describe the column by which sorting is done */
  orderBy: PropTypes.string,
  /** Row Data */
  records: PropTypes.arrayOf(
    PropTypes.object
  ),
  /** List of ids of selected rows */
  selectedRecords: PropTypes.arrayOf(
    PropTypes.number
  ),
  /** Callback when a row is selected */
  onSelectRecord: PropTypes.func,
  /** Callback when a row is clicked */
  onRowClick: PropTypes.func,
  /** Variable which describe number of rows to be displayed */
  rowsPerPage: PropTypes.number,
  /** List for showing in rows per page dropdown */
  rowsPerPageOptions: PropTypes.arrayOf(
    PropTypes.number
  ),
  /** Callback when rows per page is changed */
  onRowChange: PropTypes.func,
  /** Variable which describe current page */
  currentPage: PropTypes.number,
  /** Callback when page is changed */
  onPageChange: PropTypes.func,
  /** Variable which describes total number of records present */
  totalRecords: PropTypes.number
};

export default DataTable;