import { useDroppable } from '@dnd-kit/core';
import { Divider, Text } from '@fluentui/react-components';
import type { ReactNode } from 'react';

import Stack from '../../helper/Stack';

type KanbanColumnProps = {
    children?: ReactNode
    id: string
}

const KanbanColumn = (props: KanbanColumnProps): JSX.Element => {
    const { isOver, setNodeRef } = useDroppable({
        id: props.id,
    });
    const style = {
        color: isOver ? 'green' : undefined,
        flex: 1,
        //backgroundColor: 'red'
    };


    return (
        <Stack style={style}>
            <Divider vertical />
            <div ref={setNodeRef} style={{ width: '100%' }}>
                <Stack direction='column' >
                    <Text>{props.id}</Text>
                    <Divider />
                    {props.children}
                </Stack>
            </div>
            <Divider vertical />
        </Stack>
    );
}

export default KanbanColumn;