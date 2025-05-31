import log from 'loglevel';
import { makeAutoObservable } from 'mobx';
import { useStore } from './Store';

export class SettingsStore {
    showSettings: boolean = false;
    setShowSettings = (isOpen: boolean): void => {
        log.debug('SettingsStore | setShowSettings: ', isOpen);
        this.showSettings = isOpen;
    }

    constructor() {
        log.debug('SettingsStore created');
        makeAutoObservable(this);
    }
}

export const useSettingsStore = (): SettingsStore => {
    const store = useStore();
    return store.settingsStore!;
};