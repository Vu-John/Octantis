import React from 'react';
import PropTypes from 'prop-types';

import {Card, DataTable, Checkbox, AppProvider} from '@shopify/polaris';
import { createUniqueIDFactory } from '../../../utils/idGenerator';
import * as _ from 'lodash';

import * as styles from './styles.css';

const idGenerator = createUniqueIDFactory('table');
const tableId = idGenerator();


class FfDataTable extends React.PureComponent {
  constructor (props) {
    super(props);
  }

  componentDidMount() {
    setTimeout(() => {
      this.configureObserver();
    }, 0);
  }

  componentWillReceiveProps(nextProps) {
    if(!_.isEqual(this.props.rows.length, (nextProps.rows && nextProps.rows.length))) {
      this.configureObserver();
    }
  }

  configureObserver() {
    const { loadMoreRecords, observerRowIndex } = this.props;
    if (!loadMoreRecords) {
      return;
    }

    const table = document.getElementById(tableId);
    const rows = table.getElementsByTagName('tr') || [];

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
    const { trackSelectionBy, selectedRows, columns } = this.props;
    const formattedRow = [];

    var isSelected = _.find(selectedRows, rowId => (rowData[trackSelectionBy] === rowId || rowIndex === rowId ));
    formattedRow.push (<Checkbox checked={isSelected} onChange={() => this.onSelectRow(rowData[trackSelectionBy] || rowIndex)} />);

    _.forEach(columns, column => {
      if (column === trackSelectionBy) {
        return;
      } else {
        formattedRow.push (<div className={styles.cellElement} key={column.key} onClick={() => this.props.onRowClick(rowData)}>{ rowData[column.key] }</div>);
      }
    });

    return formattedRow;
  }

  onColumnSort = (index, direction) => {
    const { columns } = this.props;

    // index - 1 is done to ignore the header checkbox
    const column = columns[index - 1].key;
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
    const { rows, columns, sortBy, selectAllStatus } = this.props;

    // Prepare props for polaris table
    const columnContentTypes = [],
      columnHeadings = [],
      columnSortable = [],
      formattedRows = [];

    const sortedColumnIndex = _.findIndex(columns, col => col.key === sortBy.field);
    const sortDirection = sortBy.order;

    columnContentTypes.push('string');
    columnSortable.push(false);

    columnHeadings.push(<Checkbox checked={selectAllStatus} onChange={() => this.onSelectRow('all')} />);

    _.each(columns, column => {
      columnContentTypes.push(column.type);
      columnHeadings.push(column.displayName);
      columnSortable.push(column.sortable);
    })

    _.forEach(rows, (row, index) => {
      formattedRows.push(this.renderRows(row, index));
    });

    return (
      <AppProvider>
        <Card>
          <div id={tableId}>
            <DataTable
              columnContentTypes={columnContentTypes}
              headings={columnHeadings}
              sortable={columnSortable}
              rows={formattedRows}
              onSort={this.onColumnSort}
              defaultSortDirection={sortDirection}
              initialSortColumnIndex={sortedColumnIndex}
            />
            {
              !rows.length ?
                <div className={styles.noRecords}>
                  No Records found
              </div> : null
            }
          </div>
        </Card>
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

  /**
   * variable which will handle the row selection
   * usualy it will be the unique id
   */
  trackSelectionBy: PropTypes.string,
  sortBy: PropTypes.shape({
    field: PropTypes.string,
    order: PropTypes.oneOf(['ascending', 'descending'])
  }),

  selectAllStatus: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ]),

  /**
   * Index of row (from last) which will act as threshold
   * to trigger loadMoreRecords
   */
  observerRowIndex: PropTypes.number,
  /**
   * This method will be triggerd when the
   * threshold row is visible in viewport
   */
  loadMoreRecords: PropTypes.func
};

export default FfDataTable;