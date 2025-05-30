import { createContext, useContext } from 'react';
import type { CredentialStore } from './CredentialStore';
import type { NavigationStore } from './NavigationStore';
import type { TaskStore } from './TaskStore';

export class Store {
    credentialStore?: CredentialStore;
    taskStore?: TaskStore;
    navigationStore?: NavigationStore;
}

export const StoreContext = createContext<Store>(new Store());

export const useStore = (): Store => useContext(StoreContext);
