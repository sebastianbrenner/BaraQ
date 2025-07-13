import log from 'loglevel';
import { makeAutoObservable } from 'mobx';

import type { Task } from '../types/types';

export class CalendarStore {
    /**
     * The task that is currently being edited.
     */
    selectedTask: Task | null = null;

    /**
     * Set the task that is currently being edited.
     * @param task - The task that is currently being edited.
     */
    setSelectedTask = (task: Task | null): void => {
        log.debug('CalendarStore | setSelectedTask: ', task);
        this.selectedTask = task;
    }

    /**
     * The constructor for the CalendarStore class.
     */
    constructor() {
        log.trace('CalendarStore created');
        makeAutoObservable(this);
    }
}
