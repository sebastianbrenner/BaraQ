import {
    Button,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    Input,
    Label,
    Textarea,
    makeStyles,
} from '@fluentui/react-components';
import { observer } from 'mobx-react';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { useModalStore } from '../../stores/ModalStore';
import { useTaskStore } from '../../stores/TaskStore';

const useStyles = makeStyles({
    input: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        flex: 1,
    },
});

const NewProjectModal = observer((): JSX.Element => {
    const styles = useStyles();
    const { showNewProjectModal, setModal } = useModalStore();
    const { addProject } = useTaskStore();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const onSubmit = (): void => {
        if (!name.trim()) return;

        addProject({
            id: nanoid(),
            name,
            createdAt: new Date(),
        });

        setModal('newProject', false);
    };

    return (
        <Dialog
            open={showNewProjectModal}
            onOpenChange={(_, data) => setModal('newProject', data.open)}
        >
            <DialogSurface>
                <DialogBody style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <DialogTitle>Neues Projekt erstellen</DialogTitle>
                    <DialogContent>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className={styles.input}>
                                <Label htmlFor="projectName">Projektname</Label>
                                <Input
                                    id="projectName"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.input}>
                                <Label htmlFor="projectDesc">Beschreibung</Label>
                                <Textarea
                                    id="projectDesc"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button appearance="secondary" onClick={() => setModal('newProject', false)}>
                            Abbrechen
                        </Button>
                        <Button appearance="primary" onClick={onSubmit}>
                            Projekt erstellen
                        </Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
});

export default NewProjectModal;
