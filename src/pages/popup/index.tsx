import React from 'react';

import GreetingComponent from '@/components/greetings';

import logo from '../../assets/images/react.svg';

import styles from './index.module.less';

const PopupPage = () => (
  <div className={styles.app}>
    <header className={styles['app-header']}>
      <GreetingComponent />
      <img src={logo} className={styles['app-logo']} alt="logo" />
      <p>
        { 'Edit ' }
        <code>src/pages/popup/popup.tsx</code>
        { ' and save to reload.' }
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

export default PopupPage;
