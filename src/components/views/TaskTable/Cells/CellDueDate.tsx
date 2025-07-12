import { Input } from '@fluentui/react-components';

import type { Task } from '../../../../types/types';

export type CellDueDateProps = {
    item: Task,
    column: keyof Task,
    value: Date | null,
    handleChange: (item: Task, column: keyof Task, value: string | boolean) => void,
    setEditingCell: (cell: { rowId: string, column: keyof Task } | null) => void
}

const end = 10;

/**
 * Cell component for the dueDate column.
 * Renders a date input.
 * The value of the date input is the due date of the task.
 * @param item The task to be edited.
 * @param column The column of the task table.
 * @param value The due date of the task.
 * @param handleChange The function to be called when the value changes.
 * @param setEditingCell The function to be called when the cell is no longer being edited.
 * @returns The JSX element to be rendered.
 */
const CellDueDate = ({ item, column, value, handleChange, setEditingCell }: CellDueDateProps): JSX.Element => {
    const stringValue = value ? value.toISOString().substring(0, end) : '';
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
    )
}

export default CellDueDate