import log from 'loglevel';
import { makeAutoObservable } from 'mobx';

export class SettingsStore {

    constructor() {
        log.trace('SettingsStore created');
        makeAutoObservable(this);
    }
}