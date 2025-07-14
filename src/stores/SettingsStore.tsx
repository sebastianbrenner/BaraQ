import log from 'loglevel';
import { makeAutoObservable } from 'mobx';

export class SettingsStore {

    /** USER SETTINGS */

    /**
     * Whether to show completed tasks in the task table.
     */
    showCompletedTasks: boolean = false;

    /**
     * Set whether to show completed tasks in the task table.
     * @param value - Whether to show completed tasks.
     */
    setShowCompletedTasks = (value: boolean): void => {
        log.debug('TaskTableStore | setShowCompletedTasks: ', value);
        this.showCompletedTasks = value;
    }

    constructor() {
        log.trace('SettingsStore created');
        makeAutoObservable(this);
    }
}