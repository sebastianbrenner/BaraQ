import {
    Button,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    makeStyles,
    tokens
} from '@fluentui/react-components';
import { observer } from 'mobx-react';

import { useModalStore, useTaskStore, useTaskTableStore } from '../../stores/storeHooks';

const useStyles = makeStyles({
    warningButton: {
        color: tokens.colorStatusDangerForeground1,
        backgroundColor: tokens.colorStatusDangerBackground1,
        ':hover': {
            backgroundColor: tokens.colorStatusDangerBackground2,
            color: tokens.colorStatusDangerForeground3
        },
    },
});

const DeleteTaskModal = observer((): JSX.Element | null => {
    const styles = useStyles();
    const { modals: { deleteTask: deleteTaskModal }, setModal } = useModalStore();
    const { deleteTask } = useTaskStore();
    const { contextMenuTask } = useTaskTableStore();

    if (!contextMenuTask) return null;

    const onSubmit = (): void => {
        deleteTask(contextMenuTask.id);
        setModal('deleteTask', false);
    };

    return (
        <Dialog
            open={deleteTaskModal}
            onOpenChange={(_, data) => setModal('deleteTask', data.open)}
        >
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>Aufgabe löschen</DialogTitle>
                    <DialogContent>
                        Sind Sie sicher, dass Sie diese Aufgabe löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
                    </DialogContent>
                    <DialogActions>
                        <Button appearance="secondary" onClick={() => setModal('deleteTask', false)}>
                            Abbrechen
                        </Button>
                        <Button appearance="primary" className={styles.warningButton} onClick={onSubmit}>
                            Löschen
                        </Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog >
    );
});


export default DeleteTaskModal;
