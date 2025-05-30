import log from 'loglevel';
import { makeAutoObservable } from 'mobx';
import { useStore } from './Store';

export class NavigationStore {
    isDrawerOpen: boolean = false;

    setIsDrawerOpen = (isOpen: boolean): void => {
        log.debug('NavigationStore | setIsDrawerOpen: ', isOpen);
        this.isDrawerOpen = isOpen;
    };

    constructor() {
        log.debug('NavigationStore created');
        makeAutoObservable(this);
    }
}

export const useNavigationStore = (): NavigationStore => {
    const store = useStore();
    return store.navigationStore!;
};
