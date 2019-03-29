import React from 'react';
import { Icon as ShopifyIcon } from '@shopify/polaris';
import PropTypes from 'prop-types';

import styles from './styles.css';


const shopifyIcon = (source, onClick) => {
  return (
    <span onClick={onClick}>
      <ShopifyIcon source={source} />
    </span>
  );
}

const fontAwesomeIcon = (source, onClick) => {
  return (
    <span className={`${source} ${styles.customClass}`} onClick={onClick}></span>
  );
}

const Icon = (props) => {

  const { type, source, onClick } = props;

  return type === 'fa' ? fontAwesomeIcon(source, onClick) : shopifyIcon(source, onClick)
}

Icon.propTypes = {
  type: PropTypes.string,
  source: PropTypes.oneOfType(
    [PropTypes.string, PropTypes.object]
  ),
  onClick: PropTypes.func
};

export default Icon;
