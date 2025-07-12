import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { useState } from 'react';

import { useTaskStore } from '../../../stores/storeHooks';
import Stack from '../../helper/Stack';
import Draggable from './Draggable';
import KanbanColumn from './KanbanColumn';

const KanbanBoard = (): JSX.Element => {
    const containers = ['Neu', 'In Bearbeitung', 'Abgeschlossen'];
    const taskStore = useTaskStore();
    const { selectedProjectTasks } = taskStore;
    const [parent, setParent] = useState<string | null>(null);

    const handleDragEnd = (event: DragEndEvent): void => {
        const { over } = event;

        // If the item is dropped over a container, set it as the parent
        // otherwise reset the parent to `null`
        setParent(over ? over.id.toString() : null);
    }

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <Stack direction="row" gap={8} style={{ height: '100%' }}>
                {containers.map((id) => (
                    // We updated the Droppable component so it would accept an `id`
                    // prop and pass it to `useDroppable`
                    <KanbanColumn key={id} id={id}>
                        {selectedProjectTasks.map((task) => {
                            if (id === 'Neu') {
                                return (
                                    <Draggable key={task.id} id={task.id}>
                                        {task.title}
                                    </Draggable>
                                );
                            }
                        })}
                    </KanbanColumn>
                ))}
            </Stack>
        </DndContext>
    );
}

export default KanbanBoard