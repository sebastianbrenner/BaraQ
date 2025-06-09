import log from 'loglevel';
import { makeAutoObservable } from 'mobx';
import { useStore } from './Store';

export type Modal = 'newTask' | 'deleteTask' | 'newProject' | 'editProject' | 'settings';

export class ModalStore {
    modals: Record<Modal, boolean> = {
        newTask: false,
        deleteTask: false,
        newProject: false,
        editProject: false,
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
}

export const useModalStore = (): ModalStore => {
    const store = useStore();
    return store.modalStore!;
};
