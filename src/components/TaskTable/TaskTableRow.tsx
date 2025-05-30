import { Input, TableCell, TableRow } from '@fluentui/react-components';
import { type Task } from '../../types';

const TaskTableRow = (props: {
    item: Task;
    editingRowId: string;
    editedValue: string;
    handleTitleChange: () => void;
    handleTitleSave: (id: string) => void;
    handleEditClick: (id: string, title: string) => void;
}): JSX.Element => {
    const { item, editingRowId, editedValue, handleTitleChange, handleTitleSave, handleEditClick } = props;
    return (
        <TableRow key={item.id}>
            <TableCell>
                {editingRowId === item.id ? (
                    <Input
                        value={editedValue}
                        onChange={handleTitleChange}
                        onBlur={() => handleTitleSave(item.id)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleTitleSave(item.id);
                        }}
                        autoFocus
                    />
                ) : (
                    <span onClick={() => handleEditClick(item.id, item.title)}>{item.title}</span>
                )}
            </TableCell>
            <TableCell>{item.description}</TableCell>
            <TableCell>{item.priority}</TableCell>
            <TableCell>{item.dueDate.toDateString()}</TableCell>
        </TableRow>
    );
};

export default TaskTableRow;
