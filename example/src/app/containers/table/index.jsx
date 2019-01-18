import React from 'react';

import { DisplayText, Layout } from '@shopify/polaris';
import { DataTable } from '../../../../../dist';
import * as _ from 'lodash';

import styles from './styles.css';


class TableExample extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      action: null
    };

    this.columns = [
      { displayName: 'Product', field: 'product', type: 'string', sortable: false },
      { displayName: 'Status', field: 'status', type: 'string', sortable: false },
      { displayName: 'Total', field: 'total', type: 'numeric', sortable: true }
    ];

    this.records = [
      { id: '1996', product: 'Product 1', status: 'ordered', total: 34563, someData: 'Lool' },
      { id: '2965', product: 'Product 2', status: 'confirmed', total: 3453456 },
      { id: '3134', product: 'Product 3', status: 'WIP', total: 333333 },
      { id: '291651', product: 'Product 4', status: 'shipped', total: 97476 },
      { id: '11239961', product: 'Product 5', status: 'ordered', total: 34563 },
      { id: '12961325', product: 'Product 6', status: 'confirmed', total: 3453456 },
      { id: '3113234', product: 'Product 7', status: 'WIP', total: 333333 },
      { id: '2967143565', product: 'Product 8', status: 'shipped', total: 97476 },
      { id: '199556', product: 'Product 9', status: 'ordered', total: 34563 },
      { id: '2969755', product: 'Product 10', status: 'confirmed', total: 3453456 },
      { id: '3134574', product: 'Product 11', status: 'WIP', total: 333333 },
      { id: '29164645751', product: 'Product 12', status: 'shipped', total: 97476 },
      { id: '19963451', product: 'Product 13', status: 'ordered', total: 34563 },
      { id: '12963455', product: 'Product 14', status: 'confirmed', total: 3453456 },
      { id: '3110534', product: 'Product 15', status: 'WIP', total: 333333 },
      { id: '2967345343565', product: 'Product 16', status: 'shipped', total: 97476 },
      { id: '19962432', product: 'Product 17', status: 'ordered', total: 34563 },
      { id: '26564965', product: 'Product 18', status: 'confirmed', total: 3453456 },
      { id: '3132342354', product: 'Product 19', status: 'WIP', total: 333333 },
      { id: '29165231', product: 'Product 20', status: 'shipped', total: 97476 },
      { id: '19966761', product: 'Product 21', status: 'ordered', total: 34563 },
      { id: '1299905465', product: 'Product 22', status: 'confirmed', total: 3453456 },
      { id: '311323414', product: 'Product 23', status: 'WIP', total: 333333 },
      { id: '296743565', product: 'Product 24', status: 'shipped', total: 97476 },
      { id: '199fd6', product: 'Product 25', status: 'ordered', total: 34563 },
      { id: '29dfw365', product: 'Product 26', status: 'confirmed', total: 3453456 },
      { id: '31tefw34', product: 'Product 27', status: 'WIP', total: 333333 },
      { id: '291fasdfw651', product: 'Product 28', status: 'shipped', total: 97476 },
      { id: '1996cca1', product: 'Product 29', status: 'ordered', total: 34563 },
      { id: '1296s5', product: 'Product 30', status: 'confirmed', total: 3453456 },
    ];

    this.onRowClick = this.onRowClick.bind(this);
    this.onSelectionChange = this.onSelectionChange.bind(this);
    this.onSortChange = this.onSortChange.bind(this);
    this.loadMoreRecords = this.loadMoreRecords.bind(this);
  }

  onRowClick(rowData) {
    const index = _.findIndex(this.records, row => row.id === rowData.id || row.product === rowData.product);
    this.setState({
      action: 'You clicked row -> ' + (index + 1)
    });
  }

  onSelectionChange(selectedRows) {
    if (selectedRows.length === 0) {
      this.setState({
        action: 'You have unselected all rows',
        selectedRows
      })
    }
    else {
      this.setState({
        action: 'You have selected ' + selectedRows.length + ' rows',
        selectedRows
      })
    }
  }

  onSortChange(field, orderAs) {
    this.records = _.orderBy(this.records, [field], [orderAs === 'ascending' ? 'asc' : 'desc' ]);
    this.setState({
      orderField: field,
      orderAs,
      action: 'You sorted ' + field + ' in ' + orderAs + ' order'
    })
  }

  loadMoreRecords() {
    this.setState({
      action: 'You have reached the threshold and load more records is being triggered'
    })
  }

  render() {
    const { selectedRows, orderField, orderAs, action } = this.state;

    return (
      <Layout>
        <Layout.Section>
          <DisplayText size="large">Table Component with selection and sort</DisplayText>
        </Layout.Section>
        <Layout.Section>
          <div className={styles.tableContainer}>
            <DataTable
              columns={this.columns}
              onRowClick={this.onRowClick}
              rows={this.records}
              onSelectionChange={this.onSelectionChange}
              selectedRows={selectedRows}
              onSortChange={this.onSortChange}
              sortBy={{ field: orderField, order: orderAs }}
              loadMoreRecords={this.loadMoreRecords}
            />
          </div>
        </Layout.Section>
        {
          (action) ?
          <Layout.Section>
            { action }
          </Layout.Section>
          : null
        }
      </Layout>
    )
  }
}

export default TableExample;