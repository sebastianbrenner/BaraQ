import log from 'loglevel';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Store, StoreContext } from './stores/Store';

const root = createRoot(document.getElementById('root')!);

const store = new Store();

log.setLevel('debug');
log.debug('root created');

root.render(
    <StrictMode>
        <StoreContext.Provider value={store}>
            <App />
        </StoreContext.Provider>
    </StrictMode>
);
