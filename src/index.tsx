import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import log from 'loglevel';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { CredentialStore } from './stores/CredentialStore';
import { Store, StoreContext } from './stores/Store';
import { TaskStore } from './stores/TaskStore';
import { NavigationStore } from './stores/NavigationStore';

const root = createRoot(document.getElementById('root')!);

const store = new Store();

if (!store.credentialStore) {
    store.credentialStore = new CredentialStore();
}
if (!store.taskStore) {
    store.taskStore = new TaskStore();
}
if (!store.navigationStore) {
    store.navigationStore = new NavigationStore();
}

log.setLevel('debug');
log.debug('root created');

root.render(
    <StrictMode>
        <StoreContext.Provider value={store}>
            <FluentProvider theme={webLightTheme}>
                <App />
            </FluentProvider>
        </StoreContext.Provider>
    </StrictMode>
);
