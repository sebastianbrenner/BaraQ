import log from 'loglevel';
import { makeAutoObservable } from 'mobx';
import type { Project, Task } from '../types';
import { useStore } from './Store';

export class TaskStore {
    public projects: Project[] = [
        {
            id: 'project1',
            name: 'Project 1',
            createdAt: new Date(),
        },
        {
            id: 'project2',
            name: 'Project 2',
            createdAt: new Date(),
        },
        {
            id: 'project3',
            name: 'Project 3',
            createdAt: new Date(),
        },
    ];
    public selectedProject: Project = this.projects[0];
    public tasks: Task[] = [
        {
            id: '1',
            title: 'Meeting notes',
            description: 'Notes from the project kickoff meeting',
            done: true,
            priority: 'Medium',
            dueDate: new Date('2025-08-15'),
            projectId: 'project1',
            createdAt: new Date(),
        },
        {
            id: '2',
            title: 'Buy milk',
            description: 'Purchase milk for the office kitchen',
            done: false,
            priority: 'Low',
            dueDate: new Date('2025-08-16'),
            projectId: 'project1',
            createdAt: new Date(),
        },
        {
            id: '3',
            title: 'Buy coffee',
            description: 'Restock the office coffee supplies',
            done: false,
            priority: 'Low',
            dueDate: new Date('2025-08-17'),
            projectId: 'project1',
            createdAt: new Date(),
        },
        {
            id: '4',
            title: 'Buy eggs',
            description: 'Purchase eggs for the team breakfast',
            done: false,
            priority: 'Medium',
            dueDate: new Date('2025-08-18'),
            projectId: 'project2',
            createdAt: new Date(),
        },
        {
            id: '5',
            title: 'Buy bread',
            description: 'Get fresh bread for the office pantry',
            done: true,
            priority: 'High',
            dueDate: new Date('2025-08-19'),
            projectId: 'project2',
            createdAt: new Date(),
        },
        {
            id: '6',
            title: 'Buy orange',
            description: 'Stock up on oranges for healthy snacks',
            done: false,
            priority: 'Low',
            dueDate: new Date('2025-08-20'),
            projectId: 'project2',
            createdAt: new Date(),
        },
        {
            id: '7',
            title: 'Buy apple',
            description: 'Purchase apples for the office fruit bowl',
            done: false,
            priority: 'Medium',
            dueDate: new Date('2025-08-21'),
            projectId: 'project3',
            createdAt: new Date(),
        },
        {
            id: '8',
            title: 'Buy banana',
            description: 'Ensure bananas are available for smoothies',
            done: true,
            priority: 'Low',
            dueDate: new Date('2025-08-22'),
            projectId: 'project3',
            createdAt: new Date(),
        },
        {
            id: '9',
            title: 'Buy kiwi',
            description: 'Add kiwis to the weekly fruit delivery',
            done: true,
            priority: 'Low',
            dueDate: new Date('2025-08-23'),
            projectId: 'project3',
            createdAt: new Date(),
        },
    ];

    addProject = (project: Project): void => {
        log.debug('TaskStore | addProject: ', project);
        this.projects.push(project);
    };

    updateProject = (project: Project): void => {
        log.debug('TaskStore | updateProject with Id: ', project.id);
        const index = this.projects.findIndex((p) => p.id === project.id);
        if (index !== -1) {
            //this is observable-safe
            this.projects[index] = project;
        }
    }

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

    deleteTask = (taskId: string): void => {
        log.debug('TaskStore | deleteTask with Id: ', taskId);
        const index = this.tasks.findIndex((t) => t.id === taskId);
        if (index !== -1) {
            this.tasks.splice(index, 1);
        }
    };

    setSelectedProject = (projectId: string): void => {
        log.debug('TaskStore | setSelectedProject: ', projectId);
        const newSelection = this.projects.find(project => project.id === projectId);
        if (!newSelection) return;
        this.selectedProject = newSelection;
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
