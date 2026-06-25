import React from 'react';
import { createRoot } from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import App from './App';
import './styles.css';

const root = document.getElementById('app');

if (root) {
    createRoot(root).render(
        <React.StrictMode>
            <IntlProvider locale="en">
                <App />
            </IntlProvider>
        </React.StrictMode>,
    );
}
