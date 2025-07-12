import { Dropdown, makeStyles, Option } from '@fluentui/react-components';

import { PRIORITIES, type Priority, type Task } from '../../../../types/types';

export type CellPriorityCellProps = {
    item: Task,
    column: keyof Task,
    value: Priority,
    handleChange: (item: Task, column: keyof Task, value: string | boolean) => void,
    setEditingCell: (cell: { rowId: string, column: keyof Task } | null) => void
}

// Styles
const useStyles = makeStyles({
    dropdown: {
        minWidth: '100%',
    }
});

/**
 * Cell component for the priority column.
 * Renders a dropdown with all priorities.
 * The value of the dropdown is the title of the selected priority.
 * @param item The task to be edited.
 * @param column The column of the task table.
 * @param value The value of the task.
 * @param handleChange The function to be called when the value changes.
 * @param setEditingCell The function to be called when the cell is no longer being edited.
 * @returns The JSX element to be rendered.
 */
const CellPriorityCell = ({ item, column, value, handleChange, setEditingCell }: CellPriorityCellProps): JSX.Element => {
    const styles = useStyles();
    return (
        <Dropdown
            value={value}
            onOptionSelect={(_, data) => handleChange(item, column, data.optionValue ?? '')}
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
    )
}

export default CellPriorityCell