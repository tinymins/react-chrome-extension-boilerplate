import './index.css';

import React from 'react';
import { render } from 'react-dom';

import SampleComponent from './components/sample';

render(<SampleComponent />, window.document.querySelector('#app-container'));

if (module.hot) { module.hot.accept(); }
