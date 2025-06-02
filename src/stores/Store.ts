import log from 'loglevel';
import { action, makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';
import type { CredentialStore } from './CredentialStore';
import type { ModalStore } from './ModalStore';
import type { NavigationStore } from './NavigationStore';
import type { SettingsStore } from './SettingsStore';
import type { TaskStore } from './TaskStore';
import type { TaskTableStore } from './TaskTableStore';

export class Store {
    // theme
    theme: 'light' | 'dark' = 'light';

    setTheme = (theme: 'light' | 'dark'): void => {
        log.debug('Store | setTheme: ', theme);
        this.theme = theme;
    }

    // stores
    credentialStore?: CredentialStore;
    taskStore?: TaskStore;
    navigationStore?: NavigationStore;
    settingsStore?: SettingsStore;
    modalStore?: ModalStore;
    taskTableStore?: TaskTableStore;

    constructor() {
        makeObservable(this, {
            theme: observable,
            setTheme: action,
        });
    }
}

export const StoreContext = createContext<Store>(new Store());

export const useStore = (): Store => useContext(StoreContext);
