import React, { Component } from 'react';

import styles from './index.module.less';

class GreetingComponent extends Component {
  public state = {
    name: 'dev',
  };

  public render() {
    return (
      <div>
        <p>
          { `Hello, ${this.state.name}!` }
        </p>
        <img className={styles.icon} alt="extension icon" />
      </div>
    );
  }
}

export default GreetingComponent;
