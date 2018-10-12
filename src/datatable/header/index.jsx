import * as React from 'react';
import PropTypes from 'prop-types';

import {
  TableHead,
  TableRow,
  TableCell
} from '@material-ui/core';
import { Checkbox, AppProvider, Icon } from '@shopify/polaris';

import styles from './style.css';

const headStyle = {
  tableCell: {
    fontSize: 'inherit',
    whiteSpace: 'pre',
    fontFamily: 'ubuntu',
    padding: '4px 2.5vw'
  }
}


const showSortLabel = ({ orderAs, column, onSort }) => {

  const _sort = () => {
    onSort(column.key);
  }

  let icon;
  if (orderAs === 'asc') {
    icon = (<Icon source="arrowUp" />)
  }
  else if (orderAs === 'desc') {
    icon = (<Icon source="arrowDown" />)
  }

  if (column.sortable) {
    return (
      <div className={styles.sortableHeader} onClick={_sort}>
        {column.displayName}
        {icon}
      </div>
    )
  }
  return (
    column.displayName
  );
}

const TableHeader = (props) => {

  const { onSelectAll, selectAll, columns, orderAs, orderBy, onSort } = props;

  return (
     <TableHead className={styles.header}>
       <TableRow>
         {
           onSelectAll ?
             <TableCell padding="checkbox">
               <Checkbox
                 className={selectAll ? styles.check : styles.uncheck}
                 checked={selectAll}
                 onChange={onSelectAll}
                />
              </TableCell> : null
         }
         {
           columns.map((column, i) => {
             if (column && !column.hide) {
               return (
                 <TableCell
                   key={column.key}
                   numeric={column.numeric}
                   style={headStyle.tableCell}
                 >
                   {showSortLabel({ orderAs, column, onSort })}
                 </TableCell>
               );
             } else {
               return null;
             }
           })
         }
       </TableRow>
     </TableHead>
  )
}

TableHeader.propTypes = {
  selectAll: PropTypes.bool,
  onSort: PropTypes.func,
  onSelectAll: PropTypes.func,
  orderAs: PropTypes.string,
  orderBy: PropTypes.string,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      hide: PropTypes.bool,
      displayName: PropTypes.string,
      sortable: PropTypes.bool,
      key: PropTypes.string,
      numeric: PropTypes.bool
    })
  )
};

export default TableHeader;
