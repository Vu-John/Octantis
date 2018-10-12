import React from 'react';
import PropTypes from 'prop-types';
import Hidden from '@material-ui/core/Hidden';


import styles from './styles.css';


const TopNav = (props) => {
    const { logo, content, onIconClick } = props;

    return (
        <div className={styles.container}>
            <div className={styles.iconWrapper} onClick={onIconClick}>
                <i className="fa fa-bars"></i>
            </div>
            <div className={styles.logoWrapper}>
                <img src={logo} />
            </div>
            <div className={styles.content}>
                {content}
            </div>
        </div>
    )
}

TopNav.propTypes = {
    logo: PropTypes.string,
    content: PropTypes.node,
    onIconClick: PropTypes.func
}

export default TopNav;