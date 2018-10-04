import React from 'react';
import PropTypes from 'prop-types';

import ItemList from '../itemlist/index.jsx';

import * as styles from './styles.css';

const Navigation = (props) => {

  const { actionItems } = props;

  return (
    <div className={styles.wrapper}>
      {
        actionItems && actionItems.map((itemList, index) => {
          return (
            <ItemList key={index} itemsList={itemList} />
          )
        })
      }
    </div>
  )
}

Navigation.propTypes = {
  actionItems: PropTypes.arrayOf(PropTypes.object),
}

export default Navigation;