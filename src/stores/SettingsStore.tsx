import log from 'loglevel';
import { makeAutoObservable } from 'mobx';
import { useStore } from './Store';

export class SettingsStore {

    constructor() {
        log.debug('SettingsStore created');
        makeAutoObservable(this);
    }
}

export const useSettingsStore = (): SettingsStore => {
    const store = useStore();
    return store.settingsStore!;
};