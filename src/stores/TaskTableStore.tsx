import log from 'loglevel';
import { makeAutoObservable } from 'mobx';
import type { Task } from '../types';
import { useStore } from './Store';

export class TaskTableStore {
    showCompletedTasks: boolean = false;

    showContextMenu: boolean = false;

    contextMenuTask: Task | null = null;

    contextMenuPosition: { x: number; y: number } | null = null;

    setShowContextMenu = (value: boolean): void => {
        log.debug('TaskTableStore | setShowContextMenu: ', value);
        this.showContextMenu = value;
    }

    setContextMenuPosition = (position: { x: number; y: number } | null): void => {
        log.debug('TaskTableStore | setContextMenuPosition: ', position);
        this.contextMenuPosition = position;
    }

    setContextMenuTask = (task: Task | null): void => {
        log.debug('TaskTableStore | setContextMenuTask: ', task);
        this.contextMenuTask = task;
    }

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