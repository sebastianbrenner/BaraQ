import log from 'loglevel';
import { action, makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';

import { CredentialStore } from './CredentialStore';
import { ModalStore } from './ModalStore';
import { NavigationStore } from './NavigationStore';
import { SettingsStore } from './SettingsStore';
import { TaskStore } from './TaskStore';
import { TaskTableStore } from './TaskTableStore';
import { ViewStore } from './ViewStore';

export class Store {
    // theme
    theme: 'light' | 'dark' = 'light';

    setTheme = (theme: 'light' | 'dark'): void => {
        log.debug('Store | setTheme: ', theme);
        this.theme = theme;
    }

    // stores
    credentialStore: CredentialStore;
    taskStore: TaskStore;
    navigationStore: NavigationStore;
    settingsStore: SettingsStore;
    modalStore: ModalStore;
    taskTableStore: TaskTableStore;
    viewStore: ViewStore;

    constructor() {
        this.credentialStore = new CredentialStore();
        this.taskStore = new TaskStore();
        this.navigationStore = new NavigationStore();
        this.settingsStore = new SettingsStore();
        this.modalStore = new ModalStore();
        this.taskTableStore = new TaskTableStore();
        this.viewStore = new ViewStore();

        makeObservable(this, {
            theme: observable,
            setTheme: action,
        });
    }
}

export const StoreContext = createContext<Store>(new Store());

export const useStore = (): Store => useContext(StoreContext);
