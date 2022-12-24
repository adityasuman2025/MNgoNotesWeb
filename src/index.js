import React from 'react';
import ReactDOM from 'react-dom/client';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { EXTENSION_ENV_NAME, EXTENSION_ENV_VAL } from './constants';
import Routes from './Routes';

import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(<Routes />)

// not running service worker in extension
if (process.env[EXTENSION_ENV_NAME] !== EXTENSION_ENV_VAL)
    serviceWorkerRegistration.register();
