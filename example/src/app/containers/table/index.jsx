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
      { displayName: 'Product', key: 'product', type: 'string', sortable: false },
      { displayName: 'Status', key: 'status', type: 'string', sortable: false },
      { displayName: 'Total', key: 'total', type: 'numeric', sortable: true }
    ];

    this.records = [
      { id: '1', product: 'Product 1', status: 'ordered', total: 34563 },
      { id: '2', product: 'Product 2', status: 'confirmed', total: 3453456 },
      { id: '3', product: 'Product 3', status: 'WIP', total: 333333 },
      { id: '4', product: 'Product 4', status: 'shipped', total: 97476 }
    ];

    this.onRowClick = this.onRowClick.bind(this);
    this.onSelectionChange = this.onSelectionChange.bind(this);
    this.onSortChange = this.onSortChange.bind(this);
  }

  onRowClick(index) {
    this.setState({
      action: 'You clicked row -> ' + (index + 1)
    });
  }

  onSelectionChange(index) {
    if (index === this.records.length + 1) {
      if (this.records.length === this.state.selectedRows.length) {
        this.setState({
          selectedRows: [],
          action: 'You have unselected all rows'
        })
      } else {
        this.setState({
          selectedRows: _.map(this.records, (record, index) => index),
          action: `You have selected all (${this.records.length}) rows`
        })
      }
    }
    else {
      this.setState({
        selectedRows: _.xor(this.state.selectedRows, [index]),
      }, () => {
        this.setState({
        action: 'You have selected ' + this.state.selectedRows.length + ' row(s)'
        })
      });
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

  render() {
    const { selectedRows, orderField, orderAs, action } = this.state;

    return (
      <Layout>
        <Layout.Section>
          <DisplayText size="large">Table Component with selection and sort</DisplayText>
        </Layout.Section>
        {
          (action) ?
          <Layout.Section>
            { action }
          </Layout.Section>
          : null
        }
        <Layout.Section>
          <DataTable
            columns={this.columns}
            onRowClick={this.onRowClick}
            rows={this.records}
            onSelectionChange={this.onSelectionChange}
            selectedRows={selectedRows}
            onSortChange={this.onSortChange}
            sortBy={{ field: orderField, order: orderAs }}
          />
        </Layout.Section>
      </Layout>
    )
  }
}

export default TableExample;