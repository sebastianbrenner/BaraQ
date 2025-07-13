import log from 'loglevel';
import { makeAutoObservable } from 'mobx';

import type { Task } from '../types/types';

/**
 * The TaskTableStore class manages the state of the task table UI component.
 * It provides methods and state to track whether to show completed tasks,
 * show the context menu and set the task that is currently being edited.
 *
 * Usage:
 *  - To toggle showing completed tasks, use the `setShowCompletedTasks` method:
 *      taskTableStore.setShowCompletedTasks(true);
 *  - To toggle showing the context menu, use the `setShowContextMenu` method:
 *      taskTableStore.setShowContextMenu(true);
 *  - To set the task that is currently being edited in the context menu, use the `setContextMenuTask` method:
 *      taskTableStore.setContextMenuTask(task);
 *  - To set the position of the context menu, use the `setContextMenuPosition` method:
 *      taskTableStore.setContextMenuPosition({ x: 100, y: 200 });
 *
 * @class TaskTableStore
 */
export class TaskTableStore {
    /**
     * Whether the context menu is visible.
     */
    showContextMenu: boolean = false;

    /**
     * The task that is currently being edited in the context menu.
     */
    contextMenuTask: Task | null = null;

    /**
     * The position of the context menu in pixels from the top-left of the page.
     */
    contextMenuPosition: { x: number; y: number } | null = null;

    /**
     * Set whether the context menu is visible.
     * @param value - Whether the context menu is visible.
     */
    setShowContextMenu = (value: boolean): void => {
        log.debug('TaskTableStore | setShowContextMenu: ', value);
        this.showContextMenu = value;
    }

    /**
     * Set the task that is currently being edited in the context menu.
     * @param task - The task that is currently being edited.
     */
    setContextMenuTask = (task: Task | null): void => {
        log.debug('TaskTableStore | setContextMenuTask: ', task);
        this.contextMenuTask = task;
    }

    /**
     * Set the position of the context menu in pixels from the top-left of the page.
     * @param position - The position of the context menu.
     */
    setContextMenuPosition = (position: { x: number; y: number } | null): void => {
        log.debug('TaskTableStore | setContextMenuPosition: ', position);
        this.contextMenuPosition = position;
    }

    /**
     * The constructor for the TaskTableStore class.
     */
    constructor() {
        log.trace('TaskTableStore created');
        makeAutoObservable(this);
    }
}
