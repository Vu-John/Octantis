import React from 'react';
import PropTypes from 'prop-types';
import { Collapsible } from '@shopify/polaris';
import { NavLink } from 'react-router-dom';

import Icon from '../icon/index.jsx';
import * as styles from './styles.css';

const Item = ({ item }) => {

  const suffixMarkup = (
    item.count ?
      <span className={styles.count}>{item.count}</span> :
      <SecondaryIcon item={item} />
  );

  return (
    <NavLink to={item.route} className={styles.content} activeClassName={styles.contentActive}>
      <Icon source={item.icon} type={item.iconType} />
      <span>{item.content}</span>
      {suffixMarkup}
    </NavLink>
  )
}

const ChildItems = ({ item }) => {

  return (
    <Collapsible open={item.active} id={item.content}>
      {
        item.children.map(childItem => {
          return (
            <NavLink to={childItem.route} key={childItem.content}
              className={styles.childContent} activeClassName={styles.childContentActive}>
              <span>{childItem.content}</span>
            </NavLink>
          )
        })
      }
    </Collapsible>
  )
}

const SecondaryIcon = ({ item }) => {
  const _onClick = (event) => {
    event.stopPropagation();
    item.secondaryAction();
  }

  return item.secondaryIcon ?
    <Icon type={itemsList.iconType} source={item.secondaryIcon} onClick={_onClick} /> : null;
}

const ItemList = (props) => {

  const { itemsList } = props;

  let NavmenuItems = itemsList.items;

  const titleMarkup = itemsList.title ?
    (
      <div className={styles.title}>
        <div>{itemsList.title}</div>
        {
          itemsList.icon ?
            <Icon type={itemsList.iconType} source={itemsList.icon} onClick={itemsList.onIconClick} /> : null
        }
      </div>
    ) : null;

  const contentMarkup = NavmenuItems.map((item) => {

    return (
      <div key={item.content}>
        <Item item={item} />
        {
          (item.children && item.children.length) ?
          <ChildItems item={item} /> : null
        }
      </div>
    );
  });

  return (
    <div className={itemsList.bottom ? styles.bottomContent : styles.navContent}>
      {titleMarkup}
      {contentMarkup}
    </div>
  );
}

ItemList.propTypes = {
  itemsList: PropTypes.object,
}

export default ItemList;
