import log from 'loglevel';
import { makeAutoObservable } from 'mobx';
import { useStore } from './Store';

export type Modal = 'newTask' | 'newProject' | 'editProject' | 'settings';

export class ModalStore {
    showNewTaskModal: boolean = false;
    showNewProjectModal: boolean = false;
    showEditProjectModal: boolean = false;
    showSettingsModal: boolean = false;

    toggleModal = (modal: Modal): void => {
        log.debug('ModalStore | toggleModal: ', modal);
        switch (modal) {
            case 'newTask':
                this.showNewTaskModal = !this.showNewTaskModal;
                break;
            case 'newProject':
                this.showNewProjectModal = !this.showNewProjectModal;
                break;
            case 'editProject':
                this.showEditProjectModal = !this.showEditProjectModal;
                break;
            case 'settings':
                this.showSettingsModal = !this.showSettingsModal;
                break;
            default:
                throw new Error(`Unsupported modal: ${modal}`);
        }
    }

    setModal = (modal: Modal, value: boolean): void => {
        log.debug('ModalStore | setModal: ', modal, value);
        switch (modal) {
            case 'newTask':
                this.showNewTaskModal = value;
                break;
            case 'newProject':
                this.showNewProjectModal = value;
                break;
            case 'editProject':
                this.showEditProjectModal = value;
                break;
            case 'settings':
                this.showSettingsModal = value;
                break;
            default:
                throw new Error(`Unsupported modal: ${modal}`);
        }
    }

    constructor() {
        log.debug('ModalStore created');
        makeAutoObservable(this);
    }
}

export const useModalStore = (): ModalStore => {
    const store = useStore();
    return store.modalStore!;
};
