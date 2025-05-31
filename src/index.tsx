import log from 'loglevel';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { CredentialStore } from './stores/CredentialStore';
import { NavigationStore } from './stores/NavigationStore';
import { SettingsStore } from './stores/SettingsStore';
import { Store, StoreContext } from './stores/Store';
import { TaskStore } from './stores/TaskStore';

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
if (!store.settingsStore) {
    store.settingsStore = new SettingsStore();
}

log.setLevel('debug');
log.debug('root created');

root.render(
    <StrictMode>
        <StoreContext.Provider value={store}>
            <App />
        </StoreContext.Provider>
    </StrictMode>
);
