import log from 'loglevel';
import { makeAutoObservable } from 'mobx';

/**
 * The `CredentialStore` class manages user credentials and authentication state.
 * It keeps track of the username and whether the user is logged in.
 */
export class CredentialStore {
    /**
     * The username of the currently logged-in user.
     * It is optional and defaults to 'test'.
     */
    username?: string = 'test';

    /**
     * A boolean indicating whether the user is logged in.
     */
    loggedIn: boolean = false;

    /**
     * Sets the username and updates the logged-in status to true.
     *
     * @param username - The username to set.
     */
    setUsername = (username: string): void => {
        log.debug('CredentialStore | setUsername: ', username);
        this.username = username;
        this.loggedIn = true;
    };

    /**
     * Creates an instance of `CredentialStore`.
     * Initializes the store and makes it observable.
     */
    constructor() {
        log.trace('CredentialStore created');
        makeAutoObservable(this);
    }
}
