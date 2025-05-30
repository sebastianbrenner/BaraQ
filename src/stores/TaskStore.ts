import log from 'loglevel';
import { makeAutoObservable } from 'mobx';
import type { Task } from '../types';
import { useStore } from './Store';

export class TaskStore {
    public projects: string[] = ['Project 1', 'Project 2', 'Project 3'];
    public selectedProject: string | undefined = this.projects[0];
    public tasks: Task[] = [
        {
            id: '1',
            title: 'Meeting notes',
            description: 'Notes from the project kickoff meeting',
            done: true,
            priority: 'Medium',
            dueDate: new Date('2025-08-15'),
            project: 'Project 1',
        },
        {
            id: '2',
            title: 'Buy milk',
            description: 'Purchase milk for the office kitchen',
            done: false,
            priority: 'Low',
            dueDate: new Date('2025-08-16'),
            project: 'Project 1',
        },
        {
            id: '3',
            title: 'Buy coffee',
            description: 'Restock the office coffee supplies',
            done: false,
            priority: 'Low',
            dueDate: new Date('2025-08-17'),
            project: 'Project 1',
        },
        {
            id: '4',
            title: 'Buy eggs',
            description: 'Purchase eggs for the team breakfast',
            done: false,
            priority: 'Medium',
            dueDate: new Date('2025-08-18'),
            project: 'Project 2',
        },
        {
            id: '5',
            title: 'Buy bread',
            description: 'Get fresh bread for the office pantry',
            done: true,
            priority: 'High',
            dueDate: new Date('2025-08-19'),
            project: 'Project 2',
        },
        {
            id: '6',
            title: 'Buy orange',
            description: 'Stock up on oranges for healthy snacks',
            done: false,
            priority: 'Low',
            dueDate: new Date('2025-08-20'),
            project: 'Project 2',
        },
        {
            id: '7',
            title: 'Buy apple',
            description: 'Purchase apples for the office fruit bowl',
            done: false,
            priority: 'Medium',
            dueDate: new Date('2025-08-21'),
            project: 'Project 3',
        },
        {
            id: '8',
            title: 'Buy banana',
            description: 'Ensure bananas are available for smoothies',
            done: true,
            priority: 'Low',
            dueDate: new Date('2025-08-22'),
            project: 'Project 3',
        },
        {
            id: '9',
            title: 'Buy kiwi',
            description: 'Add kiwis to the weekly fruit delivery',
            done: true,
            priority: 'Low',
            dueDate: new Date('2025-08-23'),
            project: 'Project 3',
        },
    ];

    addProject = (project: string): void => {
        log.debug('TaskStore | addProject: ', project);
        this.projects.push(project);
    };

    addTask = (task: Task): void => {
        log.debug('TaskStore | addTask: ', task);
        this.tasks.push(task);
    };

    updateTask = (task: Task): void => {
        log.debug('TaskStore | updateTask with Id: ', task.id);
        const index = this.tasks.findIndex((t) => t.id === task.id);
        if (index !== -1) {
            //this is observable-safe
            this.tasks[index] = task;
        }
    };

    setSelectedProject = (project: string): void => {
        log.debug('TaskStore | setSelectedProject: ', project);
        this.selectedProject = project;
    };

    constructor() {
        log.debug('TaskStore created');
        makeAutoObservable(this);
    }
}

export const useTaskStore = (): TaskStore => {
    const store = useStore();
    return store.taskStore!;
};
