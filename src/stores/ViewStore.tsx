import { Text } from '@fluentui/react-components';
import log from 'loglevel';
import { makeAutoObservable } from 'mobx';

import CalendarView from '../components/views/Calendar/CalendarView';
import KanbanBoard from '../components/views/Kanban/KanbanBoard';
import TaskTable from '../components/views/TaskTable/TaskTable';

export const views = [
    { viewKey: 'table', label: 'Tabelle', component: <TaskTable /> },
    { viewKey: 'calendar', label: 'Kalender', component: <CalendarView /> },
    { viewKey: 'kanban', label: '🚧 Kanban 🚧', component: <KanbanBoard /> },
    { viewKey: 'flow', label: '🚧 Flow 🚧', component: <Text>flow</Text> },
];

type ViewKey = typeof views[number]['viewKey'];

/**
 * The `ViewStore` class manages the state of the currently selected view.
 *
 * It provides methods to set and access the selected view.
 *
 * Example usage:
 *  - To set the selected view, use the `setSelectedView` method:
 *      viewStore.setSelectedView('kanban');
 *  - To retrieve the current selected view, access the `selectedView` property:
 *      const currentView = viewStore.selectedView;
 *
 * @class ViewStore
 */
export class ViewStore {
    /**
     * The currently selected view key.
     * @type {ViewKey}
     */
    selectedView: ViewKey = 'calendar';

    /**
     * Sets the selected view key.
     * @param {ViewKey} view - The view key to set as selected.
     * @returns {void}
     */
    setSelectedView = (view: ViewKey): void => {
        log.debug('ViewStore | setSelectedView: ', view);
        this.selectedView = view;
    }

    /**
     * Constructs a new instance of `ViewStore`.
     */
    constructor() {
        log.trace('ViewStore created');
        makeAutoObservable(this);
    }
}
