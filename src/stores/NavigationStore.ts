import log from 'loglevel';
import { makeAutoObservable } from 'mobx';

/**
 * The `NavigationStore` class manages the state of navigation-related UI components.
 * It includes state and methods to track the state of a navigation drawer and the currently edited project.
 */
export class NavigationStore {
    /**
     * Indicates whether the navigation drawer is open.
     */
    isDrawerOpen: boolean = false;

    /**
     * Stores the ID of the project currently being edited, or `null` if no project is being edited.
     */
    editProjectId: null | string = null;

    /**
     * Sets the ID of the project currently being edited.
     *
     * @param id - The ID of the project to be edited, or `null` to clear the current project.
     */
    setEditProjectId = (id: null | string): void => {
        log.debug('NavigationStore | setEditProjectId: ', id);
        this.editProjectId = id;
    };

    /**
     * Sets the open state of the navigation drawer.
     *
     * @param isOpen - `true` to open the drawer, `false` to close it.
     */
    setIsDrawerOpen = (isOpen: boolean): void => {
        log.debug('NavigationStore | setIsDrawerOpen: ', isOpen);
        this.isDrawerOpen = isOpen;
    };

    /**
     * Constructs a new instance of `NavigationStore` and initializes the observable state.
     */
    constructor() {
        log.trace('NavigationStore created');
        makeAutoObservable(this);
    }
}
