import React from 'react';

import styles from './options.module.less';

interface Props {
  title: string;
}

const Options: React.FC<Props> = ({ title }: Props) => (
  <div className={styles['options-container']}>
    { title }
    { ' ' }
    Page
  </div>
);

export default Options;
