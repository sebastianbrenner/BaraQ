import { Checkbox, Dropdown, Input, makeStyles, Option, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow, Tag, TagGroup } from '@fluentui/react-components';
import { ChevronDown20Filled, ChevronUp20Filled } from '@fluentui/react-icons';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { useState } from 'react';
import { useTaskStore, useTaskTableStore } from '../../../stores/storeHooks';
import type { Task } from '../../../types';
import { type Priority, PRIORITIES } from '../../../types';
import { ContextMenu } from './ContextMenu';

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


const TaskTable = observer((): JSX.Element => {
    const { selectedProject, updateTask, tasks, selectedProjectTasks, getTaskById } = useTaskStore();
    const { showCompletedTasks, setContextMenuPosition, setShowContextMenu, setContextMenuTask } = useTaskTableStore();
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
        let referencedTask;
        let updatedReferencedTask;
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
                referencedTask = getTaskById(value as string);
                if (!referencedTask) return;
                updatedTask[column] = [...updatedTask[column], referencedTask.id];
                updatedReferencedTask = toJS(referencedTask);
                updatedReferencedTask.successorIds = [...updatedReferencedTask.successorIds, item.id];
                updateTask(updatedReferencedTask);
                break;
            case 'successorIds':
                referencedTask = getTaskById(value as string);
                if (!referencedTask) return;
                updatedTask[column] = [...updatedTask[column], referencedTask.id];
                updatedReferencedTask = toJS(referencedTask);
                updatedReferencedTask.predecessorIds = [...updatedReferencedTask.predecessorIds, item.id];
                updateTask(updatedReferencedTask);
                break;
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

    const renderDoneCell = (item: Task, column: keyof Task, value: boolean, handleChange: (item: Task, column: keyof Task, value: string | boolean) => void): JSX.Element => {
        return (
            <Checkbox
                checked={value}
                onChange={(_, data) => handleChange(item, column, data.checked)}
            />
        );
    };

    const renderDueDateCell = (item: Task, column: keyof Task, value: Date | null, handleChange: (item: Task, column: keyof Task, value: string | boolean) => void): JSX.Element => {
        const stringValue = value ? value.toISOString().substring(0, 10) : '';
        return (
            <Input
                type="date"
                value={stringValue}
                autoFocus
                onBlur={() => setEditingCell(null)}
                onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                        e.preventDefault();
                        setEditingCell(null);
                    }
                }}
                onChange={(e) => handleChange(item, column, e.target.value)}
            />
        );
    }

    const renderPriorityCell = (item: Task, column: keyof Task, value: Priority, handleChange: (item: Task, column: keyof Task, value: string | boolean) => void): JSX.Element => {
        return (
            <Dropdown
                value={value}
                onOptionSelect={(_, data) => handleChange(item, column, data.optionValue || '')}
                onBlur={() => setEditingCell(null)}
                autoFocus
                onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                        e.preventDefault();
                        setEditingCell(null);
                    }
                }}
                selectedOptions={[value]}
                className={styles.dropdown}
            >
                {PRIORITIES.map((priority) => (
                    <Option key={priority} >
                        {priority}
                    </Option>
                ))}
            </Dropdown>
        );
    }

    const renderDepedencyCells = (item: Task, column: keyof Task, value: string[], handleChange: (item: Task, column: keyof Task, value: string | boolean) => void): JSX.Element => {
        const stringValue = value as string[];
        const valueStrings = stringValue.map((id) => { if (getTaskById(id)) return getTaskById(id)!.title }).join(', ');
        return (
            <Dropdown
                value={valueStrings}
                onOptionSelect={(_, data) => { handleChange(item, column, data.optionValue || '') }}
                onBlur={() => setEditingCell(null)}
                autoFocus
                open
                onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                        e.preventDefault();
                        setEditingCell(null);
                    }
                }}
                selectedOptions={stringValue}
                className={styles.dropdown}
            >
                {selectedProjectTasks.map((task) => (
                    <Option key={task.id} value={task.id} text={task.title}>
                        {task.title}
                    </Option>
                ))}
            </Dropdown>
        );
    }

    // Function to render a table cell
    const renderCell = (item: Task, column: keyof Task): JSX.Element => {
        const isEditing = editingCell?.rowId === item.id && editingCell?.column === column;
        const value = item[column];
        let cellContent: JSX.Element = <>{value}</>;

        // Render cell content when in edit mode
        if (isEditing) {
            let stringValue;
            switch (column) {
                case 'done':
                    cellContent = renderDoneCell(item, column, value as boolean, handleChange);
                    break;
                case 'dueDate':
                    cellContent = renderDueDateCell(item, column, value as Date | null, handleChange);
                    break;
                case 'priority':
                    cellContent = renderPriorityCell(item, column, value as Priority, handleChange);
                    break;
                case 'predecessorIds':
                case 'successorIds':
                    cellContent = renderDepedencyCells(item, column, value as string[], handleChange);
                    break;
                default:
                    stringValue = value?.toString() ?? '';
                    cellContent =
                        <Input
                            value={stringValue}
                            autoFocus
                            onBlur={() => setEditingCell(null)}
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') {
                                    e.preventDefault();
                                    setEditingCell(null);
                                }
                            }}
                            onChange={(e) => handleChange(item, column, e.target.value)}
                        />;
            }
        }

        // Render cell content when not in edit mode
        if (!isEditing) {
            switch (column) {
                case 'done':
                    cellContent = (
                        <Checkbox
                            checked={value as boolean}
                            onChange={(ev, data) => handleChange(item, column, data.checked)}
                        />
                    );
                    break;
                case 'predecessorIds':
                case 'successorIds':
                    cellContent = (
                        <TagGroup role="list">
                            {(value as string[]).map((id) => (
                                <Tag key={id}>{getTaskById(id)!.title}</Tag>
                            ))}
                        </TagGroup>
                    )
                    break;
                default:
                    cellContent = (
                        <span >
                            {column === 'dueDate' && value instanceof Date ? value.toLocaleDateString('de-DE') : (value as string)}
                        </span>
                    );
            }
        }
        return <TableCell key={item.id + column} onClick={() => handleCellClick(item.id, column)} style={{ cursor: 'pointer' }}>{cellContent}</TableCell>
    };

    const styles = useStyles();

    const sortedTask = tasks
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
        })

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
                    {sortedTask.map((item) => (
                        <TableRow key={item.id} onContextMenu={(e) => handleContextMenu(e, item)}>
                            {Object.keys(columns).map((columnKey) => (
                                renderCell(item, columnKey as keyof Task)
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
