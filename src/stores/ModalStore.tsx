import log from 'loglevel';
import { makeAutoObservable } from 'mobx';

import DeleteProjectModal from '../components/modals/DeleteProjectModal';
import DeleteTaskModal from '../components/modals/DeleteTaskModal';
import EditProjectModal from '../components/modals/EditProjectModal';
import NewProjectModal from '../components/modals/NewProjectModal';
import NewTaskModal from '../components/modals/NewTaskModal';
import SettingsModal from '../components/modals/SettingsModal';

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

/**
 * ModalStore is a store for managing modal dialogs.
 *
 * It provides methods for toggling, setting and closing all modals.
 * The modals are stored in a Record<Modal, boolean> object where
 * the key is the modal type and the value indicates whether the modal is open or not.
 *
 * Example usage:
 *  - To toggle a modal, use the `toggleModal` method:
 *      modalStore.toggleModal('newTask');
 *  - To set a modal to a specific state, use the `setModal` method:
 *      modalStore.setModal('newTask', true);
 *  - To close all modals, use the `closeAllModals` method:
 *      modalStore.closeAllModals();
 *
 * @class ModalStore
 */
export class ModalStore {
    /**
     * Record of modals with their open state
     * @type {Record<Modal, boolean>}
     */
    modals: Record<Modal, boolean> = {
        newTask: false,
        deleteTask: false,
        newProject: false,
        editProject: false,
        deleteProject: false,
        settings: false,
    };

    /**
     * Toggles a modal
     * @param {Modal} modal - The modal to toggle
     */
    toggleModal = (modal: Modal): void => {
        log.debug('ModalStore | toggleModal:', modal);
        if (!(modal in this.modals)) {
            throw new Error(`Unsupported modal: ${modal}`);
        }
        this.modals[modal] = !this.modals[modal];
    }

    /**
     * Sets a modal to a specific state
     * @param {Modal} modal - The modal to set
     * @param {boolean} value - The state to set the modal to
     */
    setModal = (modal: Modal, value: boolean): void => {
        log.debug('ModalStore | setModal:', modal, value);
        if (!(modal in this.modals)) {
            throw new Error(`Unsupported modal: ${modal}`);
        }
        this.modals[modal] = value;
    }

    /**
     * Closes all modals
     */
    closeAllModals = (): void => {
        log.debug('ModalStore | closeAll modals');
        Object.keys(this.modals).forEach((key) => {
            this.modals[key as Modal] = false;
        });
    }

    /**
     * Creates a new ModalStore
     */
    constructor() {
        log.trace('ModalStore created');
        makeAutoObservable(this);
    }
}
