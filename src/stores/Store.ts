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

/**
 * The `Store` class is the top-level store containing all other stores.
 *
 * It provides methods for setting the theme and exposes all other stores as properties.
 *
 * Usage:
 *  - To set the theme, use the `setTheme` method:
 *      store.setTheme('dark');
 *  - To access the stores, use the corresponding properties:
 *      store.credentialStore
 *      store.taskStore
 *      store.navigationStore
 *      store.settingsStore
 *      store.modalStore
 *      store.taskTableStore
 *      store.viewStore
 *
 * @class Store
 */
export class Store {
    // theme
    /**
     * The current theme of the application.
     * Can be either 'light' or 'dark'.
     */
    theme: 'light' | 'dark' = 'light';

    /**
     * Sets the theme of the application.
     * @param theme the new theme, either 'light' or 'dark'
     */
    setTheme = (theme: 'light' | 'dark'): void => {
        log.debug('Store | setTheme: ', theme);
        this.theme = theme;
    }

    // stores
    /**
     * The credential store managing user credentials and authentication state.
     */
    credentialStore: CredentialStore;
    /**
     * The task store managing tasks and projects.
     */
    taskStore: TaskStore;
    /**
     * The navigation store managing the state of the navigation drawer and the currently edited project.
     */
    navigationStore: NavigationStore;
    /**
     * The settings store managing the application settings.
     */
    settingsStore: SettingsStore;
    /**
     * The modal store managing modal dialogs.
     */
    modalStore: ModalStore;
    /**
     * The task table store managing the state of the task table.
     */
    taskTableStore: TaskTableStore;
    /**
     * The view store managing the currently selected view.
     */
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
