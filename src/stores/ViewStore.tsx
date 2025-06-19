import log from 'loglevel';
import { makeAutoObservable } from 'mobx';

export class ViewStore {

    constructor() {
        log.debug('ViewStore created');
        makeAutoObservable(this);
    }
}