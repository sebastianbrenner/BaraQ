import type { CSSProperties, ReactNode } from 'react';
import React from 'react';

type StackProps = {
    direction?: CSSProperties['flexDirection'];
    gap?: number;
    children: ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const Stack: React.FC<StackProps> = ({ direction = 'row', gap = 8, children, style, ...rest }) => {
    // Compose styles
    const stackStyle: CSSProperties = {
        display: 'flex',
        flexDirection: direction,
        gap,
        ...style,
    };

    return (
        <div style={stackStyle} {...rest}>
            {children}
        </div>
    );
};

export default Stack;
