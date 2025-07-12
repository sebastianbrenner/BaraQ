import { Dropdown, makeStyles, Option } from '@fluentui/react-components';

import { useTaskStore } from '../../../../stores/storeHooks';
import type { Task } from '../../../../types/types';

export type CellDependecyCellProps = {
    item: Task,
    column: keyof Task,
    value: string[],
    handleChange: (item: Task, column: keyof Task, value: string | boolean) => void
    setEditingCell: (cell: { rowId: string, column: keyof Task } | null) => void
}

// Styles
const useStyles = makeStyles({
    dropdown: {
        minWidth: '100%',
    }
});

/**
 * Cell component for the predecessorIds and successorIds columns.
 * Renders a dropdown with all tasks of the selected project that are not yet done and are not already linked to the current task.
 * The value of the dropdown is the title of the selected task.
 * @param item The task to be edited.
 * @param column The column of the task table.
 * @param value The value of the task.
 * @param handleChange The function to be called when the value changes.
 * @param setEditingCell The function to be called when the cell is no longer being edited.
 * @returns The JSX element to be rendered.
 */
const CellDependecyCell = ({ item, column, value, handleChange, setEditingCell }: CellDependecyCellProps): JSX.Element => {
    const { selectedProjectTasks, getTaskById } = useTaskStore();
    const styles = useStyles();
    const stringValue = value;
    const valueStrings = stringValue.map((id) => { if (getTaskById(id)) return getTaskById(id)!.title }).join(', ');
    // filter out current task
    const noCurrentTask = selectedProjectTasks.filter((task) => task.id !== item.id);
    // filter out tasks that are already done
    const noDoneTasks = noCurrentTask.filter((task) => task.done === false);
    // filter out tasks that are already in the predecessorIds or successorIds
    const noAlreadyLinkedTasks = noDoneTasks.filter((task) => column === 'successorIds' ? !task.successorIds.includes(item.id) : !task.predecessorIds.includes(item.id));
    return (
        <Dropdown
            value={valueStrings}
            onOptionSelect={(_, data) => { handleChange(item, column, data.optionValue ?? '') }}
            onBlur={() => setEditingCell(null)}
            autoFocus
            open={noAlreadyLinkedTasks.length > 0}
            onKeyDown={(e) => {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    setEditingCell(null);
                }
            }}
            selectedOptions={stringValue}
            className={styles.dropdown}
        >
            {noAlreadyLinkedTasks.filter((task) => task.id !== item.id && task.done === false).map((task) => (
                <Option key={task.id} value={task.id} text={task.title}>
                    {task.title}
                </Option>
            ))}
        </Dropdown>
    );
}

export default CellDependecyCell