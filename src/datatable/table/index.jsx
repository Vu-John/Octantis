import React from 'react';
import PropTypes from 'prop-types';

import {DataTable, Checkbox, AppProvider, Spinner} from '@shopify/polaris';
import * as _ from 'lodash';

import * as styles from './styles.css';

class FfDataTable extends React.PureComponent {
  constructor (props) {
    super(props);
    this.tableRef = React.createRef();
  }

  componentDidMount() {
    setTimeout(() => {
      this.configureObserver();
    }, 0);
  }

  componentDidUpdate(prevProps) {
    if(!_.isEqual((prevProps.rows && prevProps.rows.length), this.props.rows.length)) {
      this.configureObserver();
    }
  }

  configureObserver() {
    const { loadMoreRecords, observerRowIndex, loadingRecords } = this.props;

    if (!loadMoreRecords || loadingRecords) {
      return;
    }

    const rows = this.tableRef.current.getElementsByTagName('tr') || [];

    if(!rows[rows.length - observerRowIndex]) {
      return;
    }

    if ('IntersectionObserver' in window) {
      // IntersectionObserver Supported
      let config = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
      };

      let observer = new IntersectionObserver(onChange, config);
      observer.observe(rows[rows.length - observerRowIndex]);

      function onChange(changes, observer) {
        _.forEach(changes, change => {
          if (change.intersectionRatio > 0) {
            loadMoreRecords();
            observer.unobserve(change.target);
          }
        });
      }

    } else {
      // IntersectionObserver NOT Supported
      loadMoreRecords();
    }
  }

  renderRows = (rowData, rowIndex) => {
    const { trackSelectionBy, selectedRows, columns, onSelectionChange } = this.props;
    const formattedRow = [];

    if (onSelectionChange) {
      var isSelected = _.find(selectedRows, rowId => (rowData[trackSelectionBy] === rowId || rowIndex === rowId ));
      formattedRow.push (
        <div>
          <Checkbox checked={isSelected} onChange={() => this.onSelectRow(rowData[trackSelectionBy] || rowIndex)} />
        </div>);
    }

    _.forEach(columns, column => {
      if (column === trackSelectionBy) {
        return;
      } else {
        formattedRow.push (<div className={styles.tableCell} key={column.field} onClick={(event) => this.props.onRowClick(event, rowData)}>{ rowData[column.field] }</div>);
      }
    });

    return formattedRow;
  }

  onColumnSort = (index, direction) => {
    const { columns } = this.props;

    // index - 1 is done to ignore the header checkbox
    const column = columns[index - 1].field;
    this.props.onSortChange(column, direction);
  }

  onSelectRow = (rowId) => {
    const { selectedRows } = this.props;
    var newlySelectedRows;

    if (rowId === 'all') {
      newlySelectedRows = rowId;
    }
    else {
      // xor will toggle the rowId in selected row array
      newlySelectedRows = _.xor(selectedRows, [rowId])
    }
    this.props.onSelectionChange(newlySelectedRows);
  }

  render() {
    const { rows, columns, sortBy, selectAllStatus, onSelectionChange, loadingRecords } = this.props;

    // Prepare props for polaris table
    const columnContentTypes = [],
      columnHeadings = [],
      columnSortable = [],
      formattedRows = [];

    var sortedColumnIndex = _.findIndex(columns, col => col.field === sortBy.field);
    const sortDirection = sortBy.order;

    if (onSelectionChange) {
      columnContentTypes.push('string');
      columnSortable.push(false);
      columnHeadings.push(<Checkbox checked={selectAllStatus} onChange={() => this.onSelectRow('all')} />);
      sortedColumnIndex += 1;
    }

    _.each(columns, column => {
      columnContentTypes.push(column.type);
      columnHeadings.push(column.displayName);
      columnSortable.push(column.sortable);
    });

    _.forEach(rows, (row, index) => {
      formattedRows.push(this.renderRows(row, index));
    });

    return (
      <AppProvider>
          <div ref={this.tableRef}
            className={loadingRecords || !rows.length ? [styles.tableWrapper, styles.loadingWrapper].join(' ') : styles.tableWrapper}>
            <DataTable
              columnContentTypes={columnContentTypes}
              headings={columnHeadings}
              sortable={columnSortable}
              rows={loadingRecords ? [] : formattedRows}
              onSort={this.onColumnSort}
              defaultSortDirection={sortDirection}
              initialSortColumnIndex={sortedColumnIndex}
            />
            {
              loadingRecords ?
              <div className={styles.loadingRecords}>
                <Spinner />
              </div> : null
            }
            {
              !rows.length && !loadingRecords ?
                <div className={styles.noRecords}>
                  No Records found
                </div> : null
            }
          </div>
      </AppProvider>
    );
  }
}

FfDataTable.defaultProps = {
  trackSelectionBy: 'id',
  observerRowIndex: 10
}

FfDataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      displayName: PropTypes.string,
      field: PropTypes.string,
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

  /**
   * variable which will handle the row selection
   * usualy it will be the unique id
   */
  trackSelectionBy: PropTypes.string,
  sortBy: PropTypes.shape({
    field: PropTypes.string,
    order: PropTypes.oneOf(['ascending', 'descending'])
  }),

  selectAllStatus: PropTypes.oneOf(['indeterminate', true, false]),


  /**
   * Index of row (from last) which will act as threshold
   * to trigger loadMoreRecords
   */
  observerRowIndex: PropTypes.number,
  /**
   * This method will be triggerd when the
   * threshold row is visible in viewport
   */
  loadMoreRecords: PropTypes.func,

  loadingRecords: PropTypes.bool
};

export default FfDataTable;