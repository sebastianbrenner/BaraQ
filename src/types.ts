export type Task = {
    id: string;
    title: string;
    description: string;
    done: boolean;
    priority: Priority;
    dueDate: Date;
    project: string;
};

export type Project = {
    id: string;
    name: string;
};

export const PRIORITIES = ['Low', 'Medium', 'High'] as const;

export type Priority = (typeof PRIORITIES)[number];
