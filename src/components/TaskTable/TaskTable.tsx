import { Checkbox, Dropdown, Input, makeStyles, Option, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from '@fluentui/react-components';
import { ChevronDown20Filled, ChevronUp20Filled } from '@fluentui/react-icons';
import { observer } from 'mobx-react';
import { useState } from 'react';
import { PRIORITIES, type Priority, type Task } from '../../types';
import { ContextMenu } from './ContextMenu';
import { useTaskStore, useTaskTableStore } from '../../stores/storeHooks';


const columns = [
    { columnKey: 'done', label: 'Erledigt' },
    { columnKey: 'title', label: 'Titel' },
    { columnKey: 'description', label: 'Beschreibung' },
    { columnKey: 'priority', label: 'Priorität' },
    { columnKey: 'dueDate', label: 'Fälligkeitsdatum' },
];

const useStyles = makeStyles({
    table: {
        minWidth: '510px',
    },
    smallColumn: {
        width: '40px',
        maxWidth: '40px',
        padding: '0 4px',
    }
});

const TaskTable = observer((): JSX.Element => {
    const { selectedProject, updateTask, tasks } = useTaskStore();
    const { showCompletedTasks, setContextMenuPosition, setShowContextMenu, setContextMenuTask } = useTaskTableStore();
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
        const updatedItem = item;
        switch (column) {
            case 'title':
            case 'description':
            case 'projectId':
                updatedItem[column] = value as string;
                break;
            case 'done':
                updatedItem[column] = value as boolean;
                break;
            case 'priority':
                updatedItem[column] = value as Priority;
                break;
            case 'dueDate':
                updatedItem[column] = new Date(value as string);
                break;
            default:
                throw new Error(`Unsupported column: ${column}`);
        }
        updateTask(updatedItem);
    };

    const handleContextMenu = (event: React.MouseEvent<HTMLTableRowElement, MouseEvent>, item: Task): void => {
        event.preventDefault();
        setContextMenuTask(item);
        setContextMenuPosition({ x: event.clientX, y: event.clientY });
        setShowContextMenu(true);
    };

    const renderCell = (item: Task, column: keyof Task): JSX.Element => {
        const isEditing = editingCell?.rowId === item.id && editingCell?.column === column;
        const value = item[column];
        let cellContent: JSX.Element;

        if (isEditing) {
            const inputType = column === 'dueDate' ? 'date' : 'text';
            const stringValue = inputType === 'date' && value instanceof Date
                ? value.toISOString().substring(0, 10)
                : (value?.toString() ?? '');

            if (column === 'priority') {
                cellContent =
                    <Dropdown
                        value={stringValue}
                        onOptionSelect={(_, data) => handleChange(item, column, data.optionValue || '')}
                        onBlur={() => setEditingCell(null)}
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                                e.preventDefault();
                                setEditingCell(null);
                            }
                        }}
                        selectedOptions={[stringValue]}
                    >
                        {PRIORITIES.map((priority) => (
                            <Option key={priority} >
                                {priority}
                            </Option>
                        ))}
                    </Dropdown>
            } else {
                cellContent =
                    <Input
                        type={inputType}
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
        } else {
            if (column === 'done') {
                cellContent = (
                    <Checkbox
                        checked={value as boolean}
                        onChange={(ev, data) => handleChange(item, column, data.checked)}
                    />
                );
            } else {
                cellContent = (
                    <span >
                        {column === 'dueDate' && value instanceof Date ? value.toDateString() : (value as string)}
                    </span>
                );
            }

            if (column === 'done') {
                return (
                    <TableCell key={item.id + column} style={{ cursor: 'pointer' }}>
                        {cellContent}
                    </TableCell>
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
            <Table aria-label="Editable Task Table" className={styles.table} sortable>
                <TableHeader>
                    <TableRow>
                        {columns.map((column) => {
                            const isSorted = sortColumn === column.columnKey;
                            const Icon = isSorted
                                ? sortDirection === 'asc'
                                    ? ChevronUp20Filled
                                    : ChevronDown20Filled
                                : null;
                            return (
                                <TableHeaderCell
                                    key={column.columnKey}
                                    onClick={() => handleSort(column.columnKey as keyof Task)}
                                    style={{ cursor: 'pointer', userSelect: 'none' }}
                                    className={column.columnKey === 'done' ? styles.smallColumn : undefined}
                                >
                                    {column.label}
                                    {Icon && <Icon />}
                                </TableHeaderCell>
                            );
                        })}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedTask.map((item) => (
                        <TableRow key={item.id} onContextMenu={(e) => handleContextMenu(e, item)}>
                            {columns.map((column) => (
                                renderCell(item, column.columnKey as keyof Task)
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
