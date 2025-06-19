import { Text } from '@fluentui/react-components';
import log from 'loglevel';
import { makeAutoObservable } from 'mobx';
import TaskTable from '../components/views/TaskTable/TaskTable';

export const views = [
    { viewKey: 'table', label: 'Tabelle', component: <TaskTable /> },
    { viewKey: 'kanban', label: 'Kanban', component: <Text>kanban</Text> },
    { viewKey: 'flow', label: 'Flow', component: <Text>flow</Text> },
];

type ViewKey = typeof views[number]['viewKey'];

export class ViewStore {
    selectedView: ViewKey = 'table';

    setSelectedView = (view: ViewKey): void => {
        log.debug('ViewStore | setSelectedView: ', view);
        this.selectedView = view;
    }

    constructor() {
        log.debug('ViewStore created');
        makeAutoObservable(this);
    }
}