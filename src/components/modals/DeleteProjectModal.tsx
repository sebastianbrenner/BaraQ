import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    Dropdown,
    makeStyles,
    Option,
    Text,
    tokens,
    type OptionOnSelectData,
    type SelectionEvents
} from '@fluentui/react-components';
import { observer } from 'mobx-react';
import { useState } from 'react';
import { useModalStore } from '../../stores/ModalStore';
import { useTaskStore } from '../../stores/TaskStore';
import Stack from '../helper/Stack';

const useStyles = makeStyles({
    warningButton: {
        color: tokens.colorStatusDangerForeground1,
        backgroundColor: tokens.colorStatusDangerBackground1,
        ':hover': {
            backgroundColor: tokens.colorStatusDangerBackground2,
            color: tokens.colorStatusDangerForeground3
        },
    },
    disabledText: {
        color: '#A0A0A0',
        opacity: 0.6,
    },
});

const DeleteProjectModal = observer((): JSX.Element | null => {
    const styles = useStyles();
    const { modals: { deleteProject: deleteProjectModal }, setModal, closeAllModals } = useModalStore();
    const { deleteProject, selectedProject, tasks, projects, setSelectedProject } = useTaskStore();

    const [moveTasks, setMoveTasks] = useState(false);
    const [moveToProject, setMoveToProject] = useState(projects.filter((project) => project.id !== selectedProject.id)[0].id);

    const disableMoveTasks = projects.length === 1;

    const handleChangeProject = (_: SelectionEvents, data: OptionOnSelectData): void => {
        if (!data.optionValue) return;
        setMoveToProject(data.optionValue);
    }

    const handleSubmit = (): void => {
        deleteProject(selectedProject.id);
        if (moveTasks) {
            tasks.forEach((task) => {
                if (task.projectId === selectedProject.id) {
                    task.projectId = moveToProject;
                }
            });
        }
        setSelectedProject(projects[0].id);
        closeAllModals();
    };

    return (
        <Dialog
            open={deleteProjectModal}
            onOpenChange={(_, data) => setModal('deleteProject', data.open)}
        >
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>Projekt löschen</DialogTitle>
                    <DialogContent>
                        <Stack direction='column'>
                            <Text>Sind Sie sicher, dass Sie dieses Projekt löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.</Text>
                            <Stack>
                                <Text weight='bold'>{tasks.filter((task) => task.projectId === selectedProject.id).length}</Text><Text> Aufgaben in diesem Projekt (offen und erledigt).</Text>
                            </Stack>
                            <Stack style={{ alignItems: 'center' }}>
                                <Checkbox
                                    disabled={disableMoveTasks}
                                    checked={moveTasks}
                                    onChange={(ev, data) => setMoveTasks(data.checked as boolean)}
                                />
                                <Text className={moveTasks ? undefined : styles.disabledText}>Aufgaben nach</Text>
                                <Dropdown
                                    id={'projectDropdown'}
                                    name="project"
                                    disabled={!moveTasks}
                                    value={projects.find((project) => project.id === moveToProject)?.name}
                                    style={{ flex: 1 }}
                                    onOptionSelect={handleChangeProject}
                                >
                                    {projects.filter((project) => project.id !== selectedProject.id).map((project) => (
                                        <Option key={project.id} value={project.id}>{project.name}</Option>
                                    ))}
                                </Dropdown>
                                <Text className={moveTasks ? undefined : styles.disabledText}>verschieben</Text>
                            </Stack>
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button appearance="secondary" onClick={() => setModal('deleteProject', false)}>
                            Abbrechen
                        </Button>
                        <Button appearance="primary" className={styles.warningButton} onClick={handleSubmit}>
                            Löschen
                        </Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog >
    );
});


export default DeleteProjectModal;
