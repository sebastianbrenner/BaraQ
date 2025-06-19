import log from 'loglevel';
import { makeAutoObservable } from 'mobx';

export class NavigationStore {
    isDrawerOpen: boolean = false;
    editProjectId: null | string = null;

    setEditProjectId = (id: null | string): void => {
        log.debug('NavigationStore | setEditProjectId: ', id);
        this.editProjectId = id;
    };

    setIsDrawerOpen = (isOpen: boolean): void => {
        log.debug('NavigationStore | setIsDrawerOpen: ', isOpen);
        this.isDrawerOpen = isOpen;
    };

    constructor() {
        log.debug('NavigationStore created');
        makeAutoObservable(this);
    }
}