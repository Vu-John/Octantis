import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../icon/index.jsx';

import * as styles from './styles.css';

const ListItem = ({ item }) => {
  let containerClasses = [styles.container];

  if (item.onAction) {
    containerClasses.push(styles.clickable);
  }

  return (
    <div className={containerClasses.join(' ')} onClick={item.onAction}>
      <Icon source={item.icon} type={item.iconType} />
      <span>
        {
          item.content
        }
      </span>
      {
        item.onAction ?
          (
            <Icon source="chevronRight" type="shopify" />
          ) : null
      }
    </div>
  )
}

const SimpleResourceList = ({ items }) => {

  return (
    <div className={styles.wrapper}>
      {
        items.map((item, index) => {
          return (
            <ListItem key={index} item={item} />
          )
        })
      }
    </div>
  )
}

SimpleResourceList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string,
      iconType: PropTypes.string,
      content: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
      ]),
      onAction: PropTypes.func
    })
  )
}

export default SimpleResourceList;