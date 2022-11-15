import React from 'react';

import logo from '../../assets/images/react.svg';

import styles from './popup.module.less';

const Popup = () => (
  <div className={styles.app}>
    <header className={styles['app-header']}>
      <img src={logo} className={styles['app-logo']} alt="logo" />
      <p>
        Edit
        { ' ' }
        <code>src/pages/popup/popup.tsx</code>
        { ' ' }
        and save to reload.
      </p>
      <a
        className={styles['app-link']}
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React!
      </a>
    </header>
  </div>
);

export default Popup;
