import { makeStyles, Table, TableBody, TableHeader, TableHeaderCell, TableRow } from '@fluentui/react-components';
import { ChevronDown20Filled, ChevronUp20Filled } from '@fluentui/react-icons';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { useState } from 'react';

import { useSettingsStore, useTaskStore, useTaskTableStore } from '../../../stores/storeHooks';
import type { Task } from '../../../types/types';
import { type Priority } from '../../../types/types';
import { ContextMenu } from './ContextMenu';
import renderCell from './renderCell';

// Column definitions
const columns = {
    done: 'Erledigt',
    title: 'Titel',
    description: 'Beschreibung',
    priority: 'Priorität',
    predecessorIds: 'Vorgänger',
    successorIds: 'Nachfolger',
    dueDate: 'Fälligkeitsdatum',
}

// Styles
const useStyles = makeStyles({
    table: {
        minWidth: '510px',
    },
    smallColumn: {
        width: 'min-content',
        //maxWidth: '50px',
        padding: '0 4px',
    },
    dropdown: {
        minWidth: '100%',
    }
});


export type renderCellProps = {
    item: Task,
    column: keyof Task,
    getTaskById: (id: string) => Task | undefined,
    setEditingCell: (cell: { rowId: string, column: keyof Task } | null) => void,
    handleChange: (item: Task, column: keyof Task, value: string | boolean) => void
    handleCellClick: (rowId: string, column: keyof Task) => void
    editingCell?: { rowId: string, column: keyof Task } | null,
}
/**
 * Renders a cell in the task table, supporting both view and edit modes.
 * Depending on the column type and editing status, different cell components are rendered.
 *
 * @param item The task to be displayed or edited.
 * @param column The column key indicating which field of the task is being rendered.
 * @param setEditingCell Function to set the current editing cell.
 * @param getTaskById Function to retrieve task details by ID.
 * @param handleChange Function to handle changes to the task's value.
 * @param handleCellClick Function to handle cell click events for entering edit mode.
 * @param editingCell The current cell being edited, if any.
 * @returns The JSX element representing the table cell.
 */

const updateReferenceIds = (
    item: Task,
    column: 'predecessorIds' | 'successorIds',
    targetId: string,
    getTaskById: (id: string) => Task | undefined,
    updateTask: (task: Task) => void
): void => {
    const referencedTask = getTaskById(targetId);
    if (!referencedTask) return;

    const updatedItem = toJS(item);
    const updatedReferenced = toJS(referencedTask);

    const hasReference = updatedItem[column].includes(targetId);

    if (column === 'predecessorIds') {
        updatedItem.predecessorIds = hasReference
            ? updatedItem.predecessorIds.filter(id => id !== targetId)
            : [...updatedItem.predecessorIds, targetId];

        updatedReferenced.successorIds = hasReference
            ? updatedReferenced.successorIds.filter(id => id !== item.id)
            : [...updatedReferenced.successorIds, item.id];
    } else {
        updatedItem.successorIds = hasReference
            ? updatedItem.successorIds.filter(id => id !== targetId)
            : [...updatedItem.successorIds, targetId];

        updatedReferenced.predecessorIds = hasReference
            ? updatedReferenced.predecessorIds.filter(id => id !== item.id)
            : [...updatedReferenced.predecessorIds, item.id];
    }

    updateTask(updatedReferenced);
    updateTask(updatedItem);
};

/**
 * TaskTable component.
 *
 * Displays a table of tasks. Supports sorting and filtering.
 *
 * @returns The JSX element representing the task table.
 */
const TaskTable = observer((): JSX.Element => {
    const { selectedProject, updateTask, tasks, getTaskById } = useTaskStore();
    const { setContextMenuPosition, setShowContextMenu, setContextMenuTask } = useTaskTableStore();
    const { showCompletedTasks } = useSettingsStore();
    // call setEditingCell(null) to exit edit mode
    const [editingCell, setEditingCell] = useState<{ rowId: string; column: keyof Task } | null>(null);

    // state for table sorting
    const [sortColumn, setSortColumn] = useState<keyof Task>('title');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const handleCellClick = (rowId: string, column: keyof Task): void => {
        setEditingCell({ rowId, column });
    };

    const handleSort = (column: keyof Task): void => {
        if (sortColumn === column) {
            // Toggle direction
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const handleChange = (item: Task, column: keyof Task, value: string | boolean): void => {
        const updatedTask = toJS(item);
        switch (column) {
            case 'title':
            case 'description':
            case 'projectId':
                updatedTask[column] = value as string;
                break;
            case 'done':
                updatedTask[column] = value as boolean;
                break;
            case 'priority':
                updatedTask[column] = value as Priority;
                break;
            case 'dueDate':
                updatedTask[column] = new Date(value as string);
                break;
            case 'predecessorIds':
            case 'successorIds':
                updateReferenceIds(item, column, value as string, getTaskById, updateTask);
                return;
            default:
                throw new Error(`Unsupported column: ${column}`);
        }
        updateTask(updatedTask);
    };

    const handleContextMenu = (event: React.MouseEvent<HTMLTableRowElement, MouseEvent>, item: Task): void => {
        event.preventDefault();
        setContextMenuTask(item);
        setContextMenuPosition({ x: event.clientX, y: event.clientY });
        setShowContextMenu(true);
    };

    const styles = useStyles();

    const sortedTasks = tasks
        .filter((item) => item.projectId === selectedProject.id)
        .filter(item => !item.done || showCompletedTasks)
        .sort((a, b) => {
            if (!sortColumn) return 0;
            const aVal = a[sortColumn];
            const bVal = b[sortColumn];

            // Convert values to comparable strings or numbers
            const aStr = aVal instanceof Date ? aVal.getTime() : aVal?.toString() ?? '';
            const bStr = bVal instanceof Date ? bVal.getTime() : bVal?.toString() ?? '';

            if (aStr < bStr) return sortDirection === 'asc' ? -1 : 1;
            if (aStr > bStr) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

    return (
        <>
            <Table aria-label="Task Table" className={styles.table} sortable>
                <TableHeader>
                    <TableRow>
                        {Object.keys(columns).map((columnKey) => {
                            const isSorted = sortColumn === columnKey;
                            const Icon = isSorted
                                ? sortDirection === 'asc'
                                    ? ChevronUp20Filled
                                    : ChevronDown20Filled
                                : null;
                            return (
                                <TableHeaderCell
                                    key={columnKey}
                                    onClick={() => handleSort(columnKey as keyof Task)}
                                    style={{ cursor: 'pointer', userSelect: 'none' }}
                                    className={columnKey === 'done' ? styles.smallColumn : undefined}
                                >
                                    {columns[columnKey as keyof typeof columns]}
                                    {Icon && <Icon />}
                                </TableHeaderCell>
                            );
                        })}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedTasks.map((item) => (
                        <TableRow key={item.id} onContextMenu={(e) => handleContextMenu(e, item)}>
                            {Object.keys(columns).map((columnKey) => (
                                renderCell({ item, column: columnKey as keyof Task, setEditingCell, getTaskById, handleChange, handleCellClick, editingCell })
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <ContextMenu />
        </>
    );
});

export default TaskTable;
