import { useDraggable } from '@dnd-kit/core';
import type { ReactNode } from 'react';

type DraggableProps = {
    children?: ReactNode
    id: string
}

const Draggable = (props: DraggableProps): JSX.Element => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: props.id,
    });
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;


    return (
        <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {props.children}
        </button>
    );
}

export default Draggable;