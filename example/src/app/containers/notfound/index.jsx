import React from 'react';

import styles from './styles.css';

export const NotFound = () => {
    return (
        <div className={styles.container}>
            <span className={styles.left}>404</span>
            <br />
            <span className={styles.right}>Are you lost?</span>
        </div>

    )
}

export default NotFound;


