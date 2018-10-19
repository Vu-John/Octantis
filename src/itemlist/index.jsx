import React from 'react';
import PropTypes from 'prop-types';
import { Collapsible } from '@shopify/polaris';

import Icon from '../icon/index.jsx';
import * as styles from './styles.css';

const Item = ({ item }) => {

  const suffixMarkup = (
    item.count ?
      <span className={styles.count}>{item.count}</span> :
      <SecondaryIcon item={item} />
  );

  const _onClick = () => {
    if (item.children) {
      item.children[0].onAction(item.children[0]);
    }
    else {
      item.onAction(item);
    }
  }

  let contentClass;

  if (item.children &&
    item.children.find(el => el.active)) {
    contentClass = styles.contentChildActive;
  }
  else if (item.active) {
    contentClass = styles.contentActive;
  }
  else {
    contentClass = styles.content;
  }

  return (
    <div className={contentClass} onClick={_onClick}>
      <Icon type={item.iconType} source={item.icon} />
      <span>{item.content}</span>
      {suffixMarkup}
    </div>
  )
}

const ChildItems = ({ item }) => {

  return (
    <Collapsible open={item.active} id={item.content}>
      {
        item.children.map(childItem => {

          let _onClick = () => {
            childItem.onAction(childItem);
          }

          return (
            <div key={childItem.content}
              className={childItem.active ? styles.childContentActive : styles.childContent}
              onClick={_onClick}>
              <span>{childItem.content}</span>
            </div>
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
