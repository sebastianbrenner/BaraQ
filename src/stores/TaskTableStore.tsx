import log from 'loglevel';
import { makeAutoObservable } from 'mobx';
import { useStore } from './Store';

export class TaskTableStore {
    showCompletedTasks: boolean = false;

    setShowCompletedTasks = (value: boolean): void => {
        log.debug('TaskTableStore | setShowCompletedTasks: ', value);
        this.showCompletedTasks = value;
    }

    constructor() {
        log.debug('TaskTableStore created');
        makeAutoObservable(this);
    }
}

export const useTaskTableStore = (): TaskTableStore => {
    const store = useStore();
    return store.taskTableStore!;
};