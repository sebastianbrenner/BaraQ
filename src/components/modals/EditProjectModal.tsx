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
    makeStyles,
    tokens
} from '@fluentui/react-components';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { useModalStore, useTaskStore, useNavigationStore } from '../../stores/storeHooks';

const useStyles = makeStyles({
    input: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        flex: 1,
    },
    warningButton: {
        color: tokens.colorStatusDangerForeground1,
        ':hover': {
            backgroundColor: tokens.colorStatusDangerBackground2,
            color: tokens.colorStatusDangerForeground3
        },
    },
});

const EditProjectModal = observer((): JSX.Element | null => {
    const styles = useStyles();
    const { modals: { editProject }, setModal } = useModalStore();
    const { updateProject, projects } = useTaskStore();
    const { editProjectId } = useNavigationStore();

    const [name, setName] = useState('');

    useEffect(() => {
        if (editProjectId) {
            const project = projects.find(project => project.id === editProjectId);
            if (project) {
                setName(project.name);
            }
        }
    }, [editProjectId, projects]);

    if (!editProjectId) return null;

    const handleSubmit = (): void => {
        if (!name.trim()) return;
        const project = projects.find((p) => p.id === editProjectId);
        if (!project) return;
        project.name = name;
        updateProject(project);
        setModal('editProject', false);
    };

    const handleDeleteProject = (): void => {
        setModal('deleteProject', true);
    };

    return (
        <Dialog
            open={editProject}
            onOpenChange={(_, data) => setModal('editProject', data.open)}
        >
            <DialogSurface>
                <DialogBody style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <DialogTitle>Projekt bearbeiten</DialogTitle>
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
                    <DialogActions>
                        <Button appearance="subtle" className={styles.warningButton} onClick={handleDeleteProject}>
                            Projekt löschen
                        </Button>
                        <Button appearance="secondary" onClick={() => setModal('editProject', false)} style={{ marginLeft: 'auto' }}>
                            Abbrechen
                        </Button>
                        <Button appearance="primary" onClick={handleSubmit}>
                            Projekt aktualisieren
                        </Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
});


export default EditProjectModal;
