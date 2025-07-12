export type Task = {
    id: string;
    title: string;
    description: string;
    done: boolean;
    priority: Priority;
    dueDate: Date;
    projectId: string;
    createdAt: Date;
    predecessorIds: string[];
    successorIds: string[];
};

export type Project = {
    id: string;
    name: string;
    createdAt: Date;
};

export const PRIORITIES = ['Niedrig', 'Mittel', 'Hoch'] as const;

export type Priority = (typeof PRIORITIES)[number];
