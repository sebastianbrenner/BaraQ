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
    makeStyles
} from '@fluentui/react-components';
import { observer } from 'mobx-react';
import { nanoid } from 'nanoid';
import { useState } from 'react';

import { useModalStore, useTaskStore } from '../../stores/storeHooks';

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
    const { modals: { newProject }, setModal } = useModalStore();
    const { addProject, setSelectedProject } = useTaskStore();

    const [name, setName] = useState('');

    const onSubmit = (): void => {
        if (!name.trim()) return;

        const id = nanoid();
        addProject({
            id,
            name,
            createdAt: new Date(),
        });

        setSelectedProject(id);
        setName('');
        setModal('newProject', false);
    };

    return (
        <Dialog
            open={newProject}
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
                        </div>
                    </DialogContent>
                    <DialogActions style={{ justifyContent: 'flex-end' }}>
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
