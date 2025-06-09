import log from 'loglevel';
import { makeAutoObservable } from 'mobx';
import DeleteProjectModal from '../components/modals/DeleteProjectModal';
import DeleteTaskModal from '../components/modals/DeleteTaskModal';
import EditProjectModal from '../components/modals/EditProjectModal';
import NewProjectModal from '../components/modals/NewProjectModal';
import NewTaskModal from '../components/modals/NewTaskModal';
import SettingsModal from '../components/modals/SettingsModal';
import { useStore } from './Store';

export type Modal = 'newTask' | 'deleteTask' | 'newProject' | 'editProject' | 'deleteProject' | 'settings';

// Map modal names to components
export const modalComponents: Record<Modal, React.FC> = {
    newTask: NewTaskModal,
    deleteTask: DeleteTaskModal,
    newProject: NewProjectModal,
    editProject: EditProjectModal,
    deleteProject: DeleteProjectModal,
    settings: SettingsModal,
};

export class ModalStore {
    modals: Record<Modal, boolean> = {
        newTask: false,
        deleteTask: false,
        newProject: false,
        editProject: false,
        deleteProject: false,
        settings: false,
    };

    constructor() {
        makeAutoObservable(this);
        log.debug('ModalStore created');
    }

    toggleModal = (modal: Modal): void => {
        log.debug('ModalStore | toggleModal:', modal);
        if (!(modal in this.modals)) {
            throw new Error(`Unsupported modal: ${modal}`);
        }
        this.modals[modal] = !this.modals[modal];
    }

    setModal = (modal: Modal, value: boolean): void => {
        log.debug('ModalStore | setModal:', modal, value);
        if (!(modal in this.modals)) {
            throw new Error(`Unsupported modal: ${modal}`);
        }
        this.modals[modal] = value;
    }

    closeAllModals = (): void => {
        log.debug('ModalStore | closeAll modals');
        Object.keys(this.modals).forEach((key) => {
            this.modals[key as Modal] = false;
        });
    }
}

export const useModalStore = (): ModalStore => {
    const store = useStore();
    return store.modalStore!;
};
