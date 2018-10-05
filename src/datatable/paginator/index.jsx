import * as React from 'react';
import PropTypes from 'prop-types';

import { Select, Pagination } from '@shopify/polaris';

import * as styles from './styles.css';

const getRowsPerPageOptions = (options) => {
  return options.map(option => {
    return ({
      label: option,
      value: option
    })
  });
}

const getPageOptions = (totalRecords, rowsPerPage) => {
  const options_array = [];
  let total_pages = totalRecords ? Math.ceil(totalRecords / rowsPerPage) : 1;
  for (var i = 1; i <= total_pages; i++) {
    options_array.push({
      label: i,
      value: i
    })
  }
  return options_array;
}

const TablePaginator = (props) => {
  var { rowsPerPage, rowsPerPageOptions, currentPage, totalRecords,
    onRowChange, onPageChange
  } = props;

  rowsPerPageOptions = rowsPerPageOptions && getRowsPerPageOptions(rowsPerPageOptions);
  var pageOptions = getPageOptions(totalRecords, rowsPerPage);

  const captionFrom = ((currentPage - 1) * rowsPerPage) + 1;
  let captionTo = currentPage * rowsPerPage;
  if (totalRecords > captionTo) {
    captionTo = totalRecords;
  }

  const onPreviousPage = () => {
    onPageChange(currentPage - 1)
  }

  const onNextPage = () => {
    onPageChange(currentPage + 1)
  }

  return (
    <div className={styles.paginator}>
      <div className={styles.options}>
        <Select
          label="Page"
          options={pageOptions}
          onChange={onPageChange}
          value={currentPage}
        />
        <Select
          label="Rows per page"
          options={rowsPerPageOptions}
          onChange={onRowChange}
          value={rowsPerPage}
        />
      </div>
      <div className={styles.navigator}>
        <span className={styles.caption}>
          {captionFrom} - {captionTo} of {totalRecords}
        </span>
        <Pagination hasPrevious={currentPage !== 1} onPrevious={onPreviousPage}
          onNext={onNextPage} hasNext={totalRecords > captionTo} plain={false} />
      </div>
    </div>
  )
}

TablePaginator.propTypes = {
  rowsPerPage: PropTypes.number,
  rowsPerPageOptions: PropTypes.array,
  onRowChange: PropTypes.func,
  currentPage: PropTypes.number,
  onPageChange: PropTypes.func,
  totalRecords: PropTypes.number
}

export default TablePaginator