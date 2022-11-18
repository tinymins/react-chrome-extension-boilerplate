import React from 'react';

import styles from './index.module.less';

interface DevToolsPageProps {}

interface DevToolsPageState {}

class DevToolsPage extends React.PureComponent<DevToolsPageProps, DevToolsPageState> {
  private updateColorTheme() {
    if (chrome.devtools.panels.themeName === 'dark') {
      window.document.documentElement.style.setProperty('--color-border-primary', '#494c50');
      window.document.documentElement.style.setProperty('--color-text-primary', '#ffffff');
      window.document.documentElement.style.setProperty('--color-text-secondary', '#9aa0a6');
      window.document.documentElement.style.setProperty('--color-background-primary', '#242424');
      window.document.documentElement.style.setProperty('--color-background-primary-active', '#000000');
      window.document.documentElement.style.setProperty('--color-background-primary-hover', '#35363a');
    } else {
      window.document.documentElement.style.setProperty('--color-border-primary', '#cacdd1');
      window.document.documentElement.style.setProperty('--color-text-primary', '#000000');
      window.document.documentElement.style.setProperty('--color-text-secondary', '#5f6368');
      window.document.documentElement.style.setProperty('--color-background-primary', '#f1f3f4');
      window.document.documentElement.style.setProperty('--color-background-primary-active', '#ffffff');
      window.document.documentElement.style.setProperty('--color-background-primary-hover', '#dee1e6');
    }
  }

  public componentDidMount(): void {
    this.updateColorTheme();
  }

  public render() {
    return (
      <div className={styles.container}>
        <h1>Dev Tools</h1>
      </div>
    );
  }
}

export default DevToolsPage;
