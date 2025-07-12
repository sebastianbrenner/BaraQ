import { Checkbox } from '@fluentui/react-components'

import type { Task } from '../../../../types/types'

export type CellCheckboxProps = {
    item: Task,
    column: keyof Task,
    value: boolean,
    handleChange: (item: Task, column: keyof Task, value: string | boolean) => void
}

/**
 * Cell component for the 'done' column.
 * Renders a checkbox reflecting the completion status of a task.
 * @param item The task to be edited.
 * @param column The column of the task table.
 * @param value The boolean value indicating the task's completion status.
 * @param handleChange The function to be called when the checkbox value changes.
 * @returns The JSX element to be rendered.
 */
const CellCheckbox = ({ item, column, value, handleChange }: CellCheckboxProps): JSX.Element => (
    <Checkbox
        checked={value}
        onChange={(_, data) => handleChange(item, column, data.checked)}
    />
)

export default CellCheckbox