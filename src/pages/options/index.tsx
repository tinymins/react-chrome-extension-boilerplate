import './index.css';

import React from 'react';
import { render } from 'react-dom';

import Options from './options';

render(
  <Options title="Settings" />,
  window.document.querySelector('#app-container'),
);

if (module.hot) { module.hot.accept(); }
