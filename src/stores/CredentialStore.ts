import log from 'loglevel';
import { makeAutoObservable } from 'mobx';

export class CredentialStore {
    username?: string = 'test';
    loggedIn: boolean = false;

    setUsername = (username: string): void => {
        log.debug('CredentialStore | setUsername: ', username);
        this.username = username;
        this.loggedIn = true;
    };

    constructor() {
        log.debug('CredentialStore created');
        makeAutoObservable(this);
    }
}