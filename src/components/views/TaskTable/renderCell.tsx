import { Checkbox, Input, TableCell, Tag, TagGroup } from '@fluentui/react-components';

import type { Priority, Task } from '../../../types/types';
import CellCheckbox from './Cells/CellCheckbox';
import CellDependecyCell from './Cells/CellDependecyCell';
import CellDueDate from './Cells/CellDueDate';
import CellPriorityCell from './Cells/CellPriorityCell';

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
const renderCell = ({ item, column, setEditingCell, getTaskById, handleChange, handleCellClick, editingCell }: renderCellProps): JSX.Element => {
    const isEditing = editingCell?.rowId === item.id && editingCell?.column === column;
    const value = item[column];
    let cellContent: JSX.Element = <>{value}</>;

    // Render cell content when in edit mode
    if (isEditing) {
        let stringValue;
        switch (column) {
            case 'done':
                cellContent = <CellCheckbox item={item} column={column} value={value as boolean} handleChange={handleChange} />;
                break;
            case 'dueDate':
                cellContent = <CellDueDate item={item} column={column} value={value as Date | null} handleChange={handleChange} setEditingCell={setEditingCell} />;
                break;
            case 'priority':
                cellContent = <CellPriorityCell item={item} column={column} value={value as Priority} handleChange={handleChange} setEditingCell={setEditingCell} />;
                break;
            case 'predecessorIds':
            case 'successorIds':
                cellContent = <CellDependecyCell item={item} column={column} value={value as string[]} handleChange={handleChange} setEditingCell={setEditingCell} />;
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
                        {(value as string[]).map((id) => {
                            const task = getTaskById(id);
                            return task ? <Tag key={id}>{task.title}</Tag> : null;
                        })}
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

export default renderCell;